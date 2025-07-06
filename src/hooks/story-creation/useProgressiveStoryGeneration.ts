
import { useState, useEffect } from 'react';
import { useStoryGeneration } from '@/hooks/useStoryGeneration';
import { supabase } from '@/integrations/supabase/client';

interface StorySegment {
  id: string;
  story_id: string;
  segment_text: string;
  image_url: string | null;
  image_generation_status: string;
  choices: string[];
  is_end: boolean;
}

export const useProgressiveStoryGeneration = () => {
  const [currentSegment, setCurrentSegment] = useState<StorySegment | null>(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const storyGeneration = useStoryGeneration();

  // Set up realtime subscription for image updates
  useEffect(() => {
    if (!currentSegment?.id) return;

    console.log('🔄 Setting up realtime subscription for segment:', currentSegment.id);

    const channel = supabase
      .channel('story-segment-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'story_segments',
          filter: `id=eq.${currentSegment.id}`
        },
        (payload) => {
          console.log('📡 Received realtime update:', payload);
          
          if (payload.new && payload.new.id === currentSegment.id) {
            const updatedSegment = payload.new as any;
            
            // Update the current segment with new image data
            setCurrentSegment(prev => prev ? {
              ...prev,
              image_url: updatedSegment.image_url,
              image_generation_status: updatedSegment.image_generation_status
            } : null);

            // Update generating state
            if (updatedSegment.image_generation_status === 'completed' || 
                updatedSegment.image_generation_status === 'failed') {
              setIsImageGenerating(false);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [currentSegment?.id]);

  const generateSegment = async (params: {
    prompt?: string;
    storyId?: string;
    parentSegmentId?: string;
    choiceText?: string;
    storyMode?: string;
    skipImage?: boolean;
    skipAudio?: boolean;
  }) => {
    try {
      console.log('🚀 Starting progressive story generation...');
      
      // Start image generation state if not skipping
      if (!params.skipImage) {
        setIsImageGenerating(true);
      }

      const segment = await storyGeneration.generateSegment(params);
      
      console.log('✅ Story segment generated:', segment);
      
      // Transform the segment data to match our interface
      const transformedSegment: StorySegment = {
        id: segment.id,
        story_id: segment.storyId,
        segment_text: segment.text,
        image_url: segment.imageUrl,
        image_generation_status: segment.imageGenerationStatus || 'generating',
        choices: segment.choices || [],
        is_end: segment.isEnd || false
      };
      
      setCurrentSegment(transformedSegment);

      // If image generation is in progress, the realtime subscription will handle updates
      if (transformedSegment.image_generation_status === 'generating') {
        console.log('🎨 Image generation in progress, waiting for realtime updates...');
        setIsImageGenerating(true);
      } else {
        setIsImageGenerating(false);
      }

      return transformedSegment;
    } catch (error) {
      console.error('❌ Progressive story generation failed:', error);
      setIsImageGenerating(false);
      throw error;
    }
  };

  return {
    currentSegment,
    isImageGenerating,
    generateSegment,
    isGenerating: storyGeneration.isGenerating,
    error: storyGeneration.error
  };
};
