
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { storyId, voiceId = 'fable' } = await req.json()

    console.log('Generating full story audio for:', { storyId, voiceId })

    if (!storyId) {
      throw new Error('Story ID is required')
    }

    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update story status to in_progress
    await supabase
      .from('stories')
      .update({ audio_generation_status: 'in_progress' })
      .eq('id', storyId)

    // Get story segments
    const { data: segments, error: segmentsError } = await supabase
      .from('story_segments')
      .select('segment_text')
      .eq('story_id', storyId)
      .order('created_at', { ascending: true })

    if (segmentsError) {
      throw new Error(`Failed to fetch story segments: ${segmentsError.message}`)
    }

    if (!segments || segments.length === 0) {
      throw new Error('No story segments found')
    }

    // Combine all segment text
    const fullText = segments.map(s => s.segment_text).join('\n\n')
    console.log('Combined text length:', fullText.length, 'characters')

    // Split text into chunks (OpenAI limit is 4096 characters)
    const maxChunkSize = 4000
    const textChunks: string[] = []
    
    if (fullText.length <= maxChunkSize) {
      textChunks.push(fullText)
    } else {
      // Split by sentences to maintain natural breaks
      const sentences = fullText.split(/[.!?]+/)
      let currentChunk = ''
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
          textChunks.push(currentChunk.trim())
          currentChunk = sentence
        } else {
          currentChunk += sentence + '. '
        }
      }
      
      if (currentChunk.trim()) {
        textChunks.push(currentChunk.trim())
      }
    }

    console.log('Split into', textChunks.length, 'chunks')

    // Generate audio for each chunk
    const audioChunks: ArrayBuffer[] = []
    
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i]
      console.log(`Generating audio for chunk ${i + 1}/${textChunks.length} (${chunk.length} chars)`)
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: chunk,
          voice: voiceId,
          response_format: 'mp3'
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenAI TTS error:', response.status, errorText)
        throw new Error(`OpenAI TTS error: ${response.status} - ${errorText}`)
      }

      const audioBuffer = await response.arrayBuffer()
      console.log(`Chunk ${i + 1} audio generated: ${audioBuffer.byteLength} bytes`)
      audioChunks.push(audioBuffer)
    }

    console.log('Combining', audioChunks.length, 'audio chunks')

    // Combine audio chunks into single buffer
    const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
    const combinedBuffer = new Uint8Array(totalLength)
    let offset = 0

    for (const chunk of audioChunks) {
      combinedBuffer.set(new Uint8Array(chunk), offset)
      offset += chunk.byteLength
    }

    console.log(`Combined audio size: ${combinedBuffer.byteLength} bytes`)

    // Upload to story-audio bucket
    const fileName = `full_story_${storyId}_${Date.now()}.mp3`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('story-audio')
      .upload(fileName, combinedBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw new Error(`Storage upload failed: ${uploadError.message}`)
    }

    console.log('Audio uploaded successfully:', uploadData.path)

    // Get public URL and verify it's accessible
    const { data: { publicUrl } } = supabase.storage
      .from('story-audio')
      .getPublicUrl(fileName)

    console.log('Public URL generated:', publicUrl)

    // Verify the uploaded file is accessible
    try {
      const verifyResponse = await fetch(publicUrl, { method: 'HEAD' })
      console.log('File verification:', {
        status: verifyResponse.status,
        headers: Object.fromEntries(verifyResponse.headers.entries())
      })
      
      if (!verifyResponse.ok) {
        throw new Error(`File not accessible: ${verifyResponse.status}`)
      }
    } catch (verifyError) {
      console.error('File verification failed:', verifyError)
      // Don't fail the entire process, but log the issue
    }

    // Update story with audio URL and completed status
    const { error: updateError } = await supabase
      .from('stories')
      .update({
        full_story_audio_url: publicUrl,
        audio_generation_status: 'completed'
      })
      .eq('id', storyId)

    if (updateError) {
      console.error('Failed to update story:', updateError)
      throw new Error(`Failed to update story: ${updateError.message}`)
    }

    console.log('✅ Full story audio generated successfully:', publicUrl)

    return new Response(
      JSON.stringify({ 
        audioUrl: publicUrl,
        success: true,
        fileSize: combinedBuffer.byteLength
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error generating full story audio:', error)
    
    // Update story status to failed if we have storyId
    try {
      const { storyId } = await req.json().catch(() => ({}))
      if (storyId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        
        await supabase
          .from('stories')
          .update({ audio_generation_status: 'failed' })
          .eq('id', storyId)
      }
    } catch (updateError) {
      console.error('Failed to update story status to failed:', updateError)
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
