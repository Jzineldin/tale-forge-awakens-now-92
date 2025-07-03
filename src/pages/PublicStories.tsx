
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/stories';
import StoryCard from '@/components/StoryCard';
import StoryCardSkeleton from '@/components/StoryCardSkeleton';

const fetchPublicStories = async () => {
  const { data, error } = await supabase
    .from('stories')
    .select('id, title, created_at, published_at, is_public, is_completed, thumbnail_url, segment_count, story_mode, full_story_audio_url, audio_generation_status, shotstack_status, shotstack_video_url')
    .eq('is_public', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as Story[];
};

const PublicStories = () => {
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['public-stories'],
    queryFn: fetchPublicStories
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Public Stories</h1>
      
      {isLoading && (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))}
        </div>
      )}
      {error && <div className="text-destructive">Error fetching stories: {error.message}</div>}

      {stories && stories.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No public stories have been shared yet.</p>
        </div>
      )}

      {stories && stories.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicStories;
