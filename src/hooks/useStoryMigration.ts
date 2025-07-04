
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { getTempStories, clearAllTempStories, removeTempStory, TempStory } from '@/utils/localStorageStories';
import { toast } from 'sonner';

export const useStoryMigration = () => {
  const { user, loading } = useAuth();

  const migrateTempStoriesToSupabase = useCallback(async (storiesToMigrate: TempStory[], userId: string) => {
    try {
      const formattedStories = storiesToMigrate.map(story => ({
        title: story.title || 'Untitled Story',
        description: story.description || '',
        story_mode: story.story_mode || 'adventure-quest',
        user_id: userId,
        is_public: false,
        created_at: story.created_at
      }));

      const { error } = await supabase.from('stories').insert(formattedStories);

      if (error) throw error;

      toast.success(`Successfully migrated ${storiesToMigrate.length} stories to your account!`);
      clearAllTempStories();
      
      return true;
    } catch (err) {
      console.error('Error migrating temporary stories:', err);
      toast.error('Failed to migrate some stories. Please try again.');
      return false;
    }
  }, []);

  const migrateSingleStory = useCallback(async (story: TempStory) => {
    if (!user) {
      toast.error('Please log in to save stories to your account.');
      return false;
    }

    try {
      const { error } = await supabase.from('stories').insert([{
        title: story.title || 'Untitled Story',
        description: story.description || '',
        story_mode: story.story_mode || 'adventure-quest',
        user_id: user.id,
        is_public: false,
        created_at: story.created_at
      }]);

      if (error) throw error;

      toast.success('Story saved to your account!');
      removeTempStory(story.id);
      
      return true;
    } catch (err) {
      console.error('Error saving story to account:', err);
      toast.error('Failed to save story to your account.');
      return false;
    }
  }, [user]);

  useEffect(() => {
    if (loading || !user) return;

    const tempStories = getTempStories();
    if (tempStories.length === 0) return;

    // Show migration prompt after a short delay
    const timer = setTimeout(() => {
      const shouldMigrate = window.confirm(
        `You have ${tempStories.length} temporary ${tempStories.length === 1 ? 'story' : 'stories'} saved locally. Would you like to save ${tempStories.length === 1 ? 'it' : 'them'} to your account permanently?`
      );

      if (shouldMigrate) {
        migrateTempStoriesToSupabase(tempStories, user.id);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, loading, migrateTempStoriesToSupabase]);

  return {
    migrateSingleStory,
    migrateTempStoriesToSupabase
  };
};
