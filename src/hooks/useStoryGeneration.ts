
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GenerateStoryParams {
  prompt?: string;
  genre?: string;
  storyId?: string;
  parentSegmentId?: string;
  choiceText?: string;
  skipImage?: boolean;
  skipAudio?: boolean;
}

export const useStoryGeneration = () => {
  const queryClient = useQueryClient();
  const activeRequestRef = useRef<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (params: GenerateStoryParams) => {
      // Create request key for deduplication
      const requestKey = JSON.stringify(params);
      
      // Prevent duplicate requests
      if (activeRequestRef.current === requestKey) {
        console.log('🚫 Preventing duplicate request:', requestKey);
        throw new Error('Request already in progress');
      }
      
      activeRequestRef.current = requestKey;
      console.log('🚀 Generating story with params:', params);

      try {
        const { data, error } = await supabase.functions.invoke('generate-story-segment', {
          body: params
        });

        console.log('📡 Raw response from edge function:', { data, error });

        if (error) {
          console.error('❌ Supabase function error:', error);
          throw new Error(error.message || 'Failed to generate story');
        }

        if (!data) {
          console.error('❌ No data returned from function');
          throw new Error('No data returned from story generation');
        }

        // Handle both old and new response formats
        if (data.success === false) {
          console.error('❌ Story generation failed:', data.error);
          throw new Error(data.error || 'Story generation failed');
        }

        // Extract the actual story data
        const storyData = data.success ? data.data : data;
        
        if (!storyData) {
          console.error('❌ No story data in response');
          throw new Error('No story data returned');
        }

        console.log('✅ Story generation successful:', storyData);
        return storyData;
      } finally {
        activeRequestRef.current = null;
      }
    },
    onSuccess: (segment) => {
      console.log('🎉 Story segment generated successfully:', segment);
      
      // Invalidate and refetch story data
      if (segment.story_id) {
        queryClient.invalidateQueries({ queryKey: ['story', segment.story_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
    onError: (error) => {
      console.error('💥 Story generation failed:', error);
      const errorMessage = error.message || 'Failed to generate story';
      console.error('Error details:', errorMessage);
    }
  });

  const generateSegment = useCallback(
    (params: GenerateStoryParams) => mutation.mutateAsync(params),
    [mutation.mutateAsync]
  );

  return {
    generateSegment,
    isGenerating: mutation.isPending,
    error: mutation.error?.message || null
  };
};
