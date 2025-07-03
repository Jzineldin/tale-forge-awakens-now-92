
import { processImageGeneration } from "./image-background-tasks.ts";
import { updateStoryContext } from "./story-updates.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export function startBackgroundTasks(
  segmentId: string,
  storyId: string,
  imagePrompt: string,
  segmentText: string,
  visualContext: any,
  narrativeContext: any,
  supabaseAdmin: SupabaseClient,
  supabaseClient: SupabaseClient
) {
  console.log('Background tasks started for segment:', segmentId);
  console.log('Visual context for background tasks:', visualContext);

  // Start image generation with visual context for character consistency
  EdgeRuntime.waitUntil(
    processImageGeneration(
      segmentId,
      storyId, 
      imagePrompt,
      supabaseAdmin,
      supabaseClient,
      visualContext // Pass visual context for character consistency
    ).then(() => {
      console.log('Image background task completed for segment:', segmentId);
    }).catch(error => {
      console.error('Image background task failed for segment:', segmentId, error);
    })
  );

  // REMOVED: Audio generation is now only triggered after story completion
  // No longer generating audio for individual segments

  // Update story context
  EdgeRuntime.waitUntil(
    updateStoryContext(storyId, visualContext, narrativeContext, supabaseAdmin)
      .then(() => {
        console.log('Story context updated for story:', storyId);
      }).catch(error => {
        console.error('Story context update failed for story:', storyId, error);
      })
  );

  console.log('Background tasks initiated for segment:', segmentId);
}
