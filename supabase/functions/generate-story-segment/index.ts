
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getGenerationSettings } from './settings.ts'
import { processImageGeneration } from './image-background-tasks.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate story content with OpenAI GPT-4o-mini
async function generateStoryContent(
  initialPrompt?: string,
  choiceText?: string,
  storyMode?: string
) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not available');
  }

  console.log('🤖 Generating story with OpenAI GPT-4o-mini...');

  // Build system prompt
  const systemPrompt = `You are a master storyteller AI. Generate immersive story segments in JSON format.

REQUIREMENTS:
- Generate 120-200 words for rich, detailed storytelling
- Create exactly 3 meaningful choices that advance the plot
- Include detailed image descriptions for visual consistency

Response format (EXACT JSON):
{
  "segmentText": "A 120-200 word story segment with vivid descriptions",
  "choices": ["Choice 1", "Choice 2", "Choice 3"],
  "isEnd": false,
  "imagePrompt": "Detailed scene description for image generation"
}`;

  const userPrompt = initialPrompt 
    ? `Start a new ${storyMode || 'fantasy'} story: "${initialPrompt}"`
    : `Continue the story. User chose: "${choiceText}"`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    
    if (!responseText) {
      throw new Error('OpenAI returned empty response');
    }
    
    const parsedResponse = JSON.parse(responseText);
    
    // Basic validation
    if (!parsedResponse.segmentText || !parsedResponse.choices) {
      throw new Error('OpenAI response missing required fields');
    }
    
    console.log('✅ Story generation successful');
    return parsedResponse;
    
  } catch (error) {
    console.error('OpenAI generation failed:', error);
    throw error;
  }
}

// Generate audio with OpenAI TTS
async function generateAudio(text: string): Promise<string | null> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY')
  if (!openAIKey) {
    console.log('⚠️ No OpenAI API key available for audio generation')
    return null
  }

  try {
    console.log('🔊 Starting audio generation...')
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

    // For now, return null since we need to implement storage upload
    console.log('✅ Audio generation successful (storage upload not implemented)')
    return null
  } catch (error) {
    console.error('Audio generation failed:', error)
    return null
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== STORY GENERATION START ===');
    
    const { prompt, genre, storyId, parentSegmentId, choiceText, skipImage, skipAudio, storyMode } = await req.json()

    console.log('🚀 Story generation request:', { 
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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Load admin settings to get proper image generation configuration
    console.log('⚙️ Loading admin settings for image generation...');
    const settings = await getGenerationSettings(supabaseAdmin);
    console.log('⚙️ Image provider settings:', settings.imageProviders);

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
    }

    // Generate story text
    console.log('📝 Starting text generation...')
    const storyResult = await generateStoryContent(prompt, choiceText, genre || storyMode || 'fantasy')
    console.log('✅ Text generation completed')

    let audioUrl = null
    let audioStatus = 'not_started'
    
    if (!skipAudio) {
      try {
        console.log('🔊 Starting audio generation...')
        audioUrl = await generateAudio(storyResult.segmentText)
        audioStatus = audioUrl ? 'completed' : 'failed';
      } catch (audioError) {
        console.error('❌ Audio generation failed:', audioError)
        audioStatus = 'failed';
      }
    }

    // Calculate word count
    const wordCount = storyResult.segmentText?.split(/\s+/).filter((word: string) => word.length > 0).length || 0;

    // Save to database - initially without image
    console.log('💾 Saving segment to database with story_id:', finalStoryId)
    const { data: segment, error } = await supabaseClient
      .from('story_segments')
      .insert({
        story_id: finalStoryId,
        parent_segment_id: parentSegmentId,
        segment_text: storyResult.segmentText,
        image_url: null, // Will be updated by background task
        audio_url: audioUrl,
        choices: storyResult.choices || [],
        triggering_choice_text: choiceText,
        is_end: storyResult.isEnd || false,
        image_generation_status: skipImage ? 'not_started' : 'pending',
        word_count: wordCount,
        audio_generation_status: audioStatus
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Successfully created segment:', segment.id)

    // Start image generation as background task if not skipped
    if (!skipImage && storyResult.imagePrompt) {
      console.log('🎨 Starting background image generation task...');
      
      // Create visual context for better image generation
      const visualContext = {
        genre: genre || storyMode || 'fantasy',
        characters: [],
        setting: '',
        previousSegments: previousSegments.map(s => s.segment_text).join(' ').substring(0, 500)
      };

      // Use background task - this will run after response is sent
      EdgeRuntime.waitUntil(
        processImageGeneration(
          segment.id,
          finalStoryId,
          storyResult.imagePrompt,
          supabaseAdmin,
          supabaseClient,
          visualContext
        )
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: segment }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('💥 Error in story generation:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Story generation failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
