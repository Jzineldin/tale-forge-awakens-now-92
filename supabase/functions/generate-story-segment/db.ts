
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface SaveStorySegmentParams {
  storyId?: string;
  parentSegmentId?: string;
  triggeringChoiceText?: string;
  segmentText: string;
  imageUrl: string;
  choices: string[];
  isEnd: boolean;
  supabaseClient: SupabaseClient;
  title?: string;
  visualContext?: any;
  narrativeContext?: any;
  storyMode?: string;
  userId?: string | null;
}

export async function saveStorySegment(params: SaveStorySegmentParams) {
  console.log('=== saveStorySegment called ===');

  const {
    storyId,
    parentSegmentId,
    triggeringChoiceText,
    segmentText,
    imageUrl,
    choices,
    isEnd,
    supabaseClient,
    title,
    visualContext,
    narrativeContext,
    storyMode,
    userId,
  } = params;

  let finalStoryId = storyId;

  // Create story if it doesn't exist
  if (!finalStoryId) {
    console.log('Creating new story...');

    const { data: newStory, error: storyError } = await supabaseClient
      .from('stories')
      .insert({
        title: title || 'Untitled Story',
        user_id: userId,
        visual_context: visualContext,
        narrative_context: narrativeContext,
        story_mode: storyMode,
      })
      .select()
      .single();

    if (storyError) {
      console.error('Story creation error:', storyError);
      throw new Error(`Failed to create story: ${storyError.message}`);
    }

    finalStoryId = newStory.id;
    console.log('New story created with ID:', finalStoryId);
  }

  // Insert the story segment
  console.log('Inserting story segment...');

  const { data: segment, error: segmentError } = await supabaseClient
    .from('story_segments')
    .insert({
      story_id: finalStoryId,
      parent_segment_id: parentSegmentId,
      triggering_choice_text: triggeringChoiceText,
      segment_text: segmentText,
      image_url: imageUrl,
      choices,
      is_end: isEnd,
    })
    .select()
    .single();

  if (segmentError) {
    console.error('Segment creation error:', segmentError);
    console.error('Error code:', segmentError.code);
    console.error('Error details:', segmentError.details);
    throw new Error(`Failed to save segment: ${segmentError.message}`);
  }

  console.log('Story segment created successfully with ID:', segment.id);
  return segment;
}
