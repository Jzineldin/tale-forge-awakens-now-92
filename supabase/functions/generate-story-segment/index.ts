import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createEnhancedImagePrompt } from './enhanced-image-prompting.ts'
import { buildNarrativeContext, generateContextAwarePrompt, type NarrativeContext } from './narrative-context.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function cleanAndValidateAPIKey() {
  console.log('=== API KEY VALIDATION ===');
  
  let apiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!apiKey) {
    console.error('❌ No OPENAI_API_KEY found in environment');
    return null;
  }
  
  apiKey = apiKey.trim().replace(/[\r\n]/g, '');
  
  console.log('✅ API key found and cleaned');
  console.log('Key length:', apiKey.length);
  console.log('Key format valid:', apiKey.startsWith('sk-'));
  
  if (!apiKey.startsWith('sk-') || apiKey.length < 40) {
    console.error('🚨 Invalid API key format');
    return null;
  }
  
  return apiKey;
}

// Background image generation and storage function
async function generateImageInBackground(
  segmentId: string,
  storyText: string,
  storyContext: any = {},
  previousSegments: any[] = [],
  supabaseClient: any
) {
  console.log('🎨 Starting background image generation for segment:', segmentId);
  
  const cleanApiKey = cleanAndValidateAPIKey();
  if (!cleanApiKey) {
    console.error('❌ API key validation failed for background image generation');
    return;
  }

  try {
    // Create enhanced prompt with visual consistency
    const enhancedPrompt = createEnhancedImagePrompt(
      storyText,
      previousSegments,
      {
        genre: storyContext.genre || 'fantasy',
        mainCharacters: storyContext.characters || [],
        setting: storyContext.setting || '',
        artStyle: 'digital illustration, storybook style, high quality, consistent character design'
      }
    );

    console.log('🖼️ Enhanced image prompt:', enhancedPrompt.substring(0, 200) + '...');

    // Generate image with DALL-E-3
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Tale-Forge/1.0'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        response_format: 'url'
      }),
    });

    console.log('🎨 Background image generation status:', response.status);

    if (response.ok) {
      const result = await response.json();
      const tempImageUrl = result.data[0]?.url;
      
      if (tempImageUrl) {
        console.log('📥 Fetching image for permanent storage...');
        
        // Fetch the generated image
        const imageResponse = await fetch(tempImageUrl);
        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          
          // Upload to Supabase storage
          const fileName = `story_image_${Date.now()}.png`;
          console.log('📤 Uploading to story-images bucket...');
          
          const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('story-images')
            .upload(fileName, imageBlob, {
              contentType: 'image/png',
            });

          if (uploadError) {
            console.error('❌ Upload failed:', uploadError);
            // Update segment with temp URL as fallback
            await supabaseClient
              .from('story_segments')
              .update({ 
                image_url: tempImageUrl, 
                image_generation_status: 'completed' 
              })
              .eq('id', segmentId);
            return;
          }

          // Get permanent public URL
          const { data: { publicUrl } } = supabaseClient.storage
            .from('story-images')
            .getPublicUrl(uploadData.path);

          console.log('✅ Image permanently stored, updating segment:', publicUrl);
          
          // Update the segment with the permanent image URL
          await supabaseClient
            .from('story_segments')
            .update({ 
              image_url: publicUrl, 
              image_generation_status: 'completed' 
            })
            .eq('id', segmentId);
            
          console.log('✅ Background image generation completed for segment:', segmentId);
        }
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Background image generation failed:', errorText);
      
      // Update segment status to failed
      await supabaseClient
        .from('story_segments')
        .update({ image_generation_status: 'failed' })
        .eq('id', segmentId);
    }
    
  } catch (error) {
    console.error('❌ Background image generation error:', error);
    
    // Update segment status to failed
    await supabaseClient
      .from('story_segments')
      .update({ image_generation_status: 'failed' })
      .eq('id', segmentId);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== PROGRESSIVE STORY GENERATION START ===');
    
    const { prompt, genre, storyId, parentSegmentId, choiceText, skipImage, skipAudio, storyMode } = await req.json()

    console.log('🚀 Progressive request:', { 
      hasPrompt: !!prompt, 
      genre: genre || storyMode, 
      storyId, 
      parentSegmentId, 
      choiceText,
      skipImage,
      skipAudio 
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Create story first if no storyId provided
    let finalStoryId = storyId;
    if (!finalStoryId && prompt) {
      console.log('📝 Creating new story record...');
      const { data: newStory, error: storyError } = await supabaseClient
        .from('stories')
        .insert({
          title: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
          description: prompt,
          story_mode: genre || storyMode || 'fantasy',
          user_id: null
        })
        .select()
        .single();

      if (storyError) {
        console.error('❌ Story creation error:', storyError);
        throw new Error(`Failed to create story: ${storyError.message}`);
      }

      finalStoryId = newStory.id;
      console.log('✅ New story created with ID:', finalStoryId);
    }

    // Fetch previous segments for context
    let previousSegments: any[] = [];
    if (finalStoryId) {
      const { data: segments } = await supabaseClient
        .from('story_segments')
        .select('*')
        .eq('story_id', finalStoryId)
        .order('created_at', { ascending: true });
      
      previousSegments = segments || [];
      console.log('📚 Loaded', previousSegments.length, 'previous segments for context');
    }

    // Build comprehensive narrative context
    const narrativeContext = buildNarrativeContext(previousSegments, genre || storyMode || 'fantasy');
    console.log('🧠 Narrative context built:', {
      stage: narrativeContext.storyArc.stage,
      progress: narrativeContext.storyArc.progressPercentage,
      plotThreads: narrativeContext.plotThreads.length,
      characters: narrativeContext.characters.protagonist.traits
    });

    // Generate story text (this is the only blocking operation)
    console.log('📝 Starting story text generation...')
    const storyResult = await generateEnhancedStoryText(
      prompt, 
      genre || storyMode || 'fantasy', 
      choiceText, 
      narrativeContext,
      previousSegments
    )
    console.log('✅ Story text generation completed:', {
      textLength: storyResult.text?.length,
      choicesCount: storyResult.choices?.length
    })

    // Calculate word count
    const wordCount = storyResult.text?.split(/\s+/).filter(word => word.length > 0).length || 0;

    // Save segment with text immediately - set image status as 'generating' if not skipping
    console.log('💾 Saving segment with immediate text response')
    const { data: segment, error } = await supabaseClient
      .from('story_segments')
      .insert({
        story_id: finalStoryId,
        parent_segment_id: parentSegmentId,
        segment_text: storyResult.text,
        image_url: null, // Will be updated by background task
        audio_url: null, // Audio generation still synchronous for now
        choices: storyResult.choices || [],
        triggering_choice_text: choiceText,
        is_end: storyResult.isEnd || false,
        image_generation_status: skipImage ? 'not_started' : 'generating',
        word_count: wordCount,
        audio_generation_status: 'not_started'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Segment saved with immediate text response:', segment.id)

    // Start background image generation if not skipped
    if (!skipImage && segment.id) {
      console.log('🎨 Starting background image generation...');
      EdgeRuntime.waitUntil(
        generateImageInBackground(
          segment.id,
          storyResult.text,
          {
            genre: genre || storyMode || 'fantasy',
            characters: narrativeContext.characters,
            setting: narrativeContext.worldBuilding.setting
          },
          previousSegments,
          supabaseClient
        )
      );
    }

    // Return immediate response with text content
    console.log('🚀 Returning immediate response with text content');
    return new Response(
      JSON.stringify({ success: true, data: segment }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('💥 Error in progressive story generation:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Progressive story generation failed',
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})

async function generateEnhancedStoryText(
  prompt: string, 
  genre: string, 
  choiceText: string | null,
  narrativeContext: NarrativeContext,
  previousSegments: any[]
) {
  console.log('🤖 Starting enhanced story generation with full context...')
  
  const openAIKey = Deno.env.get('OPENAI_API_KEY')
  if (openAIKey) {
    try {
      console.log('🚀 Using enhanced OpenAI GPT-4.1-2025-04-14 with narrative context')
      return await generateWithEnhancedOpenAI(prompt, genre, choiceText, openAIKey, narrativeContext, previousSegments)
    } catch (error) {
      console.error('❌ Enhanced OpenAI generation failed:', error)
    }
  }
  
  // Fallback with basic generation
  console.log('🔄 Using fallback generation')
  return generateFallbackStory(prompt, genre, choiceText, narrativeContext)
}

async function generateWithEnhancedOpenAI(
  prompt: string, 
  genre: string, 
  choiceText: string | null, 
  apiKey: string,
  narrativeContext: NarrativeContext,
  previousSegments: any[]
) {
  // Create context-aware system prompt
  const contextPrompt = generateContextAwarePrompt('', choiceText, narrativeContext, genre);
  
  const enhancedSystemPrompt = `${contextPrompt}

CRITICAL REQUIREMENTS for ${genre} story generation:
- Generate exactly 200-300 words for rich, immersive storytelling
- Create exactly 3 meaningful choices that advance the plot logically
- Maintain character consistency and development
- Advance active plot threads meaningfully
- Ensure choices are relevant to current story context and character goals
- Include detailed image description for visual consistency
- Keep narrative coherent with established world rules and atmosphere

STORY CONTINUITY RULES:
- Reference previous events and choices when relevant
- Maintain established character traits and relationships
- Continue active plot threads before introducing new ones
- Respect the current story arc stage and pacing
- Ensure all choices are logical given current circumstances

Respond with JSON in this EXACT format:
{
  "text": "Your 200-300 word story segment with rich details and continuity",
  "choices": ["Choice 1 that advances main plot", "Choice 2 that explores character", "Choice 3 that develops subplot"],
  "isEnd": false,
  "imagePrompt": "Detailed scene description for consistent visual generation"
}`;

  const userPrompt = prompt 
    ? `Start a new ${genre} story: "${prompt}"`
    : `Continue the ${genre} story. The reader chose: "${choiceText}"
    
Previous story context: ${previousSegments.slice(-2).map(s => s.segment_text).join(' ')}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: enhancedSystemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Enhanced OpenAI API error:', response.status, errorText)
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  try {
    const parsed = JSON.parse(content)
    return {
      text: parsed.text,
      choices: parsed.choices || ["Continue the adventure", "Take a different approach", "Investigate further"],
      isEnd: parsed.isEnd || false,
      imagePrompt: parsed.imagePrompt || parsed.text
    }
  } catch {
    return {
      text: content,
      choices: ["Continue the adventure", "Take a different approach", "Investigate further"],
      isEnd: false,
      imagePrompt: content
    }
  }
}

function generateFallbackStory(
  prompt: string, 
  genre: string, 
  choiceText: string | null,
  narrativeContext: NarrativeContext
) {
  const stageInstructions = {
    'setup': 'establishing the world and characters',
    'rising_action': 'building tension and complexity',
    'climax': 'reaching the story\'s peak moment',
    'falling_action': 'resolving conflicts',
    'resolution': 'bringing the story to a satisfying conclusion'
  };
  
  const currentGoal = narrativeContext.characters.protagonist.currentGoal;
  const stageDescription = stageInstructions[narrativeContext.storyArc.stage];
  
  return {
    text: `In this ${genre} adventure, you find yourself ${stageDescription}. ${currentGoal ? `Your current goal is ${currentGoal}.` : ''} ${prompt || choiceText || 'The story continues...'} As you navigate this situation, you realize that every decision you make will shape not just your immediate future, but the very essence of your journey. The world around you responds to your choices, creating new possibilities and challenges. What started as a simple situation has evolved into something far more complex and meaningful, testing your resolve and character in ways you never expected.`,
    choices: [
      `Continue with ${narrativeContext.characters.protagonist.traits[0] || 'bold'} determination`,
      "Seek more information before acting",
      "Try a completely different approach"
    ],
    isEnd: narrativeContext.storyArc.stage === 'resolution',
    imagePrompt: `${genre} scene: character in ${narrativeContext.worldBuilding.setting} with ${narrativeContext.worldBuilding.atmosphere} atmosphere`
  }
}

async function generateAudio(text: string): Promise<string | null> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY')
  if (!openAIKey) {
    console.log('⚠️ No OpenAI API key available for audio generation')
    return null
  }

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text.substring(0, 4096),
        voice: "alloy"
      })
    })

    if (!response.ok) {
      console.error('Audio generation API error:', response.status)
      return null
    }

    return null
  } catch (error) {
    console.error('Audio generation failed:', error)
    return null
  }
}
