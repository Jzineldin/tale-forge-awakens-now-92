
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateAudio, uploadAudioToStorage } from "./audio.ts";

export const generateAndUpdateAudio = async (
    newSegmentId: string,
    segmentText: string,
    voiceId: string,
    supabaseAdmin: SupabaseClient
) => {
    const taskTimerLabel = `[background] Audio task for segment ${newSegmentId}`;
    console.time(taskTimerLabel);
    
    try {
        console.log(`[background] Starting audio generation for segment ${newSegmentId}`);
        
        let audioResult;
        try {
            console.time(`[background] generateAudio for ${newSegmentId}`);
            audioResult = await generateAudio(segmentText, voiceId);
            console.timeEnd(`[background] generateAudio for ${newSegmentId}`);
        } catch (audioGenError) {
            console.error(`[background] Audio generation failed for segment ${newSegmentId}:`, audioGenError);
            // Don't throw here - just log and return early
            console.warn(`[background] Skipping audio for segment ${newSegmentId} due to generation failure`);
            return;
        }

        if (!audioResult) {
          console.warn(`[background] No audio result for segment ${newSegmentId} - skipping audio update`);
          return;
        }

        const { audioBuffer, duration } = audioResult;
        console.log(`[background] Audio generated for segment ${newSegmentId}, duration: ${duration}s`);

        let finalAudioUrl;
        try {
            console.time(`[background] uploadAudioToStorage for ${newSegmentId}`);
            finalAudioUrl = await uploadAudioToStorage(audioBuffer, supabaseAdmin);
            console.timeEnd(`[background] uploadAudioToStorage for ${newSegmentId}`);
            console.log(`[background] Successfully uploaded audio for segment ${newSegmentId}: ${finalAudioUrl}`);
        } catch (uploadError) {
            console.error(`[background] Failed to upload audio for segment ${newSegmentId}:`, uploadError);
            // Don't fail the entire task, just skip the audio update
            console.warn(`[background] Skipping audio update for segment ${newSegmentId} due to upload failure`);
            return;
        }
        
        // Update the database with audio details
        try {
            console.time(`[background] db.update.audio for ${newSegmentId}`);
            const { error: updateError } = await supabaseAdmin
              .from('story_segments')
              .update({ audio_url: finalAudioUrl, audio_duration: duration })
              .eq('id', newSegmentId);
            console.timeEnd(`[background] db.update.audio for ${newSegmentId}`);

            if (updateError) {
              console.error(`[background] Failed to update segment ${newSegmentId} with audio:`, updateError);
              throw updateError;
            } else {
              console.log(`[background] Successfully updated segment ${newSegmentId} with audio URL and duration`);
            }
        } catch (dbUpdateError) {
            console.error(`[background] Database update failed for audio in segment ${newSegmentId}:`, dbUpdateError);
            throw dbUpdateError;
        }
        
    } catch(error) {
        console.error(`[background] Critical error in audio generation task for segment ${newSegmentId}:`, error);
        // Re-throw the error so the calling code knows the task failed failed
        throw error;
    } finally {
        console.timeEnd(taskTimerLabel);
    }
};

// Add alias for backward compatibility
export const processAudioGeneration = generateAndUpdateAudio;
