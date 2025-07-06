
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createEnhancedImagePrompt } from './enhanced-image-prompting.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Debug and validate API key
function cleanAndValidateAPIKey() {
  console.log('=== API KEY VALIDATION ===');
  
  let apiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!apiKey) {
    console.error('❌ No OPENAI_API_KEY found in environment');
    return null;
  }
  
  // Clean the API key
  const originalKey = apiKey;
  apiKey = apiKey.trim(); // Remove whitespace
  apiKey = apiKey.replace(/[\r\n]/g, ''); // Remove newlines
  
  if (originalKey !== apiKey) {
    console.log('🧹 API key was cleaned (had whitespace/newlines)');
  }
  
  console.log('✅ API key found');
  console.log('Key length:', apiKey.length);
  console.log('Key prefix:', apiKey.substring(0, 7));
  console.log('Key format valid:', apiKey.startsWith('sk-'));
  
  // Check for common issues
  if (apiKey.includes(' ')) {
    console.error('🚨 API key contains spaces - this will cause 403 errors');
  }
  
  if (!apiKey.startsWith('sk-')) {
    console.error('🚨 API key doesn\'t start with "sk-" - invalid format');
    return null;
  }
  
  if (apiKey.length < 40) {
    console.error('🚨 API key too short - invalid format');
    return null;
  }
  
  return apiKey;
}

// Enhanced image generation with better prompting
async function generateImageWithEnhancedPrompting(
  storyText: string, 
  storyContext: any = {},
  previousSegments: any[] = []
): Promise<string | null> {
  console.log('🎨 Starting enhanced image generation...');
  
  const cleanApiKey = cleanAndValidateAPIKey();
  if (!cleanApiKey) {
    console.error('❌ API key validation failed');
    return null;
  }

  // Create enhanced prompt
  const enhancedPrompt = createEnhancedImagePrompt(
    storyText,
    previousSegments,
    {
      genre: storyContext.genre || 'fantasy',
      mainCharacters: storyContext.characters || [],
      setting: storyContext.setting || '',
      artStyle: 'digital illustration, storybook style, high quality'
    }
  );

  console.log('🖼️ Enhanced prompt created:', enhancedPrompt.substring(0, 200) + '...');

  try {
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

    console.log('🎨 Enhanced image generation status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Enhanced image generated successfully');
      return result.data[0]?.url;
    } else {
      const errorText = await response.text();
      console.error('❌ Enhanced image generation failed:', errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Enhanced image generation error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== ENHANCED STORY GENERATION START ===');
    
    const { prompt, genre, storyId, parentSegmentId, choiceText, skipImage, skipAudio, storyMode } = await req.json()

    console.log('🚀 Enhanced story generation request:', { 
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

    // CRITICAL FIX: Create story first if no storyId provided
    let finalStoryId = storyId;
    if (!finalStoryId && prompt) {
      console.log('📝 Creating new story record...');
      const { data: newStory, error: storyError } = await supabaseClient
        .from('stories')
        .insert({
          title: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
          description: prompt,
          story_mode: genre || storyMode || 'fantasy',
          user_id: null // Allow anonymous stories
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

    // Generate story text first
    console.log('📝 Starting enhanced text generation...')
    const storyResult = await generateStoryText(prompt, genre || storyMode || 'fantasy', choiceText)
    console.log('✅ Text generation completed:', {
      textLength: storyResult.text?.length,
      choicesCount: storyResult.choices?.length
    })
    
    let imageUrl = null
    let imageStatus = 'not_started'
    
    if (!skipImage) {
      console.log('🎨 Starting enhanced image generation...')
      
      try {
        imageUrl = await generateImageWithEnhancedPrompting(
          storyResult.text,
          {
            genre: genre || storyMode || 'fantasy',
            characters: [],
            setting: ''
          },
          previousSegments
        );
        
        imageStatus = imageUrl ? 'completed' : 'failed';
        console.log('✅ Enhanced image generation result:', { imageUrl: !!imageUrl, status: imageStatus });
      } catch (imageError) {
        console.error('❌ Enhanced image generation failed:', imageError);
        imageStatus = 'failed';
      }
    }

    let audioUrl = null
    let audioStatus = 'not_started'
    
    if (!skipAudio) {
      try {
        console.log('🔊 Starting audio generation...')
        audioUrl = await generateAudio(storyResult.text)
        audioStatus = audioUrl ? 'completed' : 'failed';
        console.log('✅ Audio generation completed:', { audioUrl: !!audioUrl })
      } catch (audioError) {
        console.error('❌ Audio generation failed:', audioError)
        audioStatus = 'failed';
      }
    }

    // Calculate word count
    const wordCount = storyResult.text?.split(/\s+/).filter(word => word.length > 0).length || 0;

    // Save to database with enhanced data - ENSURE storyId is set
    console.log('💾 Saving enhanced segment to database with story_id:', finalStoryId)
    const { data: segment, error } = await supabaseClient
      .from('story_segments')
      .insert({
        story_id: finalStoryId, // CRITICAL: Ensure this is not null
        parent_segment_id: parentSegmentId,
        segment_text: storyResult.text,
        image_url: imageUrl,
        audio_url: audioUrl,
        choices: storyResult.choices || [],
        triggering_choice_text: choiceText,
        is_end: storyResult.isEnd || false,
        image_generation_status: imageStatus,
        word_count: wordCount,
        audio_generation_status: audioStatus
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Database error:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log('✅ Successfully created enhanced segment:', segment.id)

    return new Response(
      JSON.stringify({ success: true, data: segment }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('💥 Error in enhanced story generation:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Enhanced story generation failed',
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})

async function generateStoryText(prompt: string, genre: string, choiceText?: string) {
  console.log('🤖 Attempting story generation...')
  
  const openAIKey = Deno.env.get('OPENAI_API_KEY')
  if (openAIKey) {
    try {
      console.log('🚀 Using OpenAI GPT-4.1-2025-04-14 for text generation')
      return await generateWithOpenAI(prompt, genre, choiceText, openAIKey)
    } catch (error) {
      console.error('❌ OpenAI generation failed:', error)
    }
  } else {
    console.log('⚠️ OpenAI API key not found')
  }
  
  const googleKey = Deno.env.get('GOOGLE_API_KEY')
  if (googleKey) {
    try {
      console.log('🔄 Using Google Gemini for text generation')
      return await generateWithGoogle(prompt, genre, choiceText, googleKey)
    } catch (error) {
      console.error('❌ Google AI generation failed:', error)
    }
  } else {
    console.log('⚠️ Google API key not found')
  }
  
  console.log('🔄 All AI services failed, using fallback response')
  return {
    text: `In the realm of ${genre.toLowerCase()}, your adventure begins with an intriguing situation: ${prompt || choiceText}. The world around you is filled with possibilities, and every decision you make will shape the path ahead. As you stand at this crossroads, you feel the weight of destiny upon your shoulders, knowing that your choices will determine not just your fate, but perhaps the fate of all those around you.`,
    choices: [
      "Explore the mysterious path ahead",
      "Seek guidance from a wise mentor", 
      "Trust your instincts and forge ahead boldly"
    ],
    isEnd: false
  }
}

async function generateWithOpenAI(prompt: string, genre: string, choiceText?: string, apiKey: string) {
  const systemPrompt = `You are a master storyteller. Create engaging ${genre} story segments.

CRITICAL REQUIREMENTS:
- Generate 150-250 words for rich, immersive storytelling
- Create exactly 3 meaningful choices that advance the plot
- Match the ${genre} genre perfectly
- Use vivid, descriptive language

Respond with JSON in this EXACT format:
{
  "text": "Your 150-250 word story segment here",
  "choices": ["Choice 1", "Choice 2", "Choice 3"],
  "isEnd": false
}`

  const userPrompt = prompt 
    ? `Start a new ${genre} story: "${prompt}"`
    : `Continue the ${genre} story. The reader chose: "${choiceText}"`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OpenAI API error:', response.status, errorText)
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  try {
    return JSON.parse(content)
  } catch {
    return {
      text: content,
      choices: ["Continue the adventure", "Take a different approach", "Investigate further"],
      isEnd: false
    }
  }
}

async function generateWithGoogle(prompt: string, genre: string, choiceText?: string, apiKey: string) {
  const systemPrompt = `Create an engaging ${genre} story segment.

Requirements:
- Write 150-250 words
- Create exactly 3 compelling choices
- Match the ${genre} genre
- Use vivid descriptions

Format as JSON:
{
  "text": "Your story segment",
  "choices": ["Choice 1", "Choice 2", "Choice 3"],
  "isEnd": false
}`

  const userPrompt = prompt 
    ? `Start a ${genre} story: "${prompt}"`
    : `Continue the story. Reader chose: "${choiceText}"`

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ 
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] 
      }]
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Google AI API error:', response.status, errorText)
    throw new Error(`Google AI API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.candidates[0].content.parts[0].text
  
  try {
    return JSON.parse(content)
  } catch {
    return {
      text: content,
      choices: ["Continue the adventure", "Take a different path", "Investigate further"],
      isEnd: false
    }
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
