
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useStoryGeneration } from '@/hooks/useStoryGeneration';
import { useStoryState } from '@/hooks/useStoryState';
import { useStoryLoader } from './useStoryDisplay/useStoryLoader';
import { useStoryActions } from './useStoryDisplay/useStoryActions';
import { StorySegment } from './useStoryDisplay/types';
import { isValidUUID, isProperUUID } from './useStoryDisplay/utils';
import { supabase } from '@/integrations/supabase/client';

interface StoryData {
  id: string;
  title?: string;
  full_story_audio_url?: string | null;
  audio_generation_status?: string;
  is_public?: boolean;
}

export const useStoryDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [currentStorySegment, setCurrentStorySegment] = useState<StorySegment | null>(null);
  const [allStorySegments, setAllStorySegments] = useState<StorySegment[]>([]);
  const [segmentCount, setSegmentCount] = useState(0);
  const [maxSegments] = useState(8);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [skipImage, setSkipImage] = useState(false);
  const [skipAudio, setSkipAudio] = useState(true); // Always true during story creation
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [viewMode, setViewMode] = useState<'create' | 'player'>('create');
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [storyLoaded, setStoryLoaded] = useState(false);

  const storyGeneration = useStoryGeneration();
  const {
    apiUsageCount,
    showCostDialog,
    pendingAction,
    pendingParams,
    setShowCostDialog,
    setPendingAction,
    incrementApiUsage,
    addToHistory
  } = useStoryState();

  // Get parameters from URL
  const genre = searchParams.get('genre') || searchParams.get('mode') || 'fantasy';
  const prompt = searchParams.get('prompt') || '';
  const characterName = searchParams.get('characterName') || '';

  // Custom hooks
  const { loadExistingStory } = useStoryLoader();
  const { confirmGeneration, handleFinishStory } = useStoryActions(
    storyGeneration,
    addToHistory,
    incrementApiUsage
  );

  // Fetch story data including full audio URL
  const fetchStoryData = async (storyId: string) => {
    // Only query database for proper UUIDs
    if (!isProperUUID(storyId)) {
      console.log('Skipping database query for custom story ID:', storyId);
      return;
    }
    
    try {
      console.log('📚 Fetching story data for:', storyId);
      const { data: story, error } = await supabase
        .from('stories')
        .select('id, title, full_story_audio_url, audio_generation_status, is_public')
        .eq('id', storyId)
        .single();

      if (error) {
        console.error('Error fetching story data:', error);
        return;
      }

      if (story) {
        console.log('📚 Story data loaded:', { 
          id: story.id, 
          hasAudio: !!story.full_story_audio_url,
          audioStatus: story.audio_generation_status 
        });
        setStoryData(story);
      }
    } catch (error) {
      console.error('Error fetching story data:', error);
    }
  };

  // Add refresh function for audio generation callbacks
  const refreshStoryData = async () => {
    if (!id || !isValidUUID(id)) return;
    
    console.log('🔄 Refreshing story data after audio generation...');
    await fetchStoryData(id);
  };

  // Set up real-time subscription for story updates
  useEffect(() => {
    // Only set up subscription for proper UUIDs
    if (!id || !isProperUUID(id)) return;

    console.log('🔔 Setting up real-time subscription for story:', id);
    
    const subscription = supabase
      .channel(`story-updates-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stories',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('🔔 Real-time story update received:', {
            storyId: id,
            audioStatus: payload.new?.audio_generation_status,
            audioUrl: payload.new?.full_story_audio_url ? 'Present' : 'Missing',
            timestamp: new Date().toISOString()
          });
          
          // Update story data with new audio information
          if (payload.new) {
            setStoryData(prev => ({
              ...prev,
              ...payload.new,
              id: payload.new.id,
              title: payload.new.title,
              full_story_audio_url: payload.new.full_story_audio_url,
              audio_generation_status: payload.new.audio_generation_status
            }));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up real-time subscription for story:', id);
      supabase.removeChannel(subscription);
    };
  }, [id]);

  // Refetch story segments when switching modes to ensure data is fresh
  const refetchStorySegments = async () => {
    // Only refetch for proper UUIDs
    if (!id || !isProperUUID(id)) return;
    
    console.log('🔄 Refetching story segments for mode switch...');
    try {
      const { data: segments, error } = await supabase
        .from('story_segments')
        .select('*')
        .eq('story_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (segments && segments.length > 0) {
        const enhancedSegments = segments.map(segment => ({
          ...segment,
          audio_generation_status: segment.audio_generation_status || 'not_started',
          word_count: segment.word_count || segment.segment_text?.split(/\s+/).length || 0
        })) as StorySegment[];
        
        console.log('🔄 Refreshed segments:', enhancedSegments.map(s => ({ 
          id: s.id, 
          hasAudio: !!s.audio_url,
          audioStatus: s.audio_generation_status 
        })));
        
        setAllStorySegments(enhancedSegments);
        setCurrentStorySegment(enhancedSegments[enhancedSegments.length - 1]);
        setSegmentCount(enhancedSegments.length);
      }
      
      // Also refetch story data when refetching segments
      await fetchStoryData(id);
    } catch (error) {
      console.error('Error refetching story segments:', error);
    }
  };

  const showConfirmation = (action: 'start' | 'choice', choice?: string) => {
    console.log('🎬 Showing confirmation dialog for action:', action, 'with choice:', choice);
    setPendingAction(action, { choice });
    setShowCostDialog(true);
  };

  const handleConfirmGeneration = async () => {
    console.log('🚀 Starting story generation confirmation...', { pendingAction, pendingParams });
    setShowCostDialog(false);
    await confirmGeneration(
      pendingAction,
      pendingParams,
      genre,
      prompt,
      characterName,
      skipImage,
      true, // Always skip audio during story creation
      currentStorySegment,
      setError,
      setCurrentStorySegment,
      setAllStorySegments,
      setSegmentCount,
      setPendingAction
    );
  };

  const handleChoiceSelect = (choice: string) => {
    if (segmentCount >= maxSegments) {
      handleFinishStory(currentStorySegment, setCurrentStorySegment, setAllStorySegments);
      return;
    }
    showConfirmation('choice', choice);
  };

  const handleStoryFinish = async () => {
    console.log('🏁 Finishing story...');
    await handleFinishStory(currentStorySegment, setCurrentStorySegment, setAllStorySegments);
  };

  const handleViewModeChange = async (newMode: 'create' | 'player') => {
    console.log('🔄 Switching view mode from', viewMode, 'to', newMode);
    setViewMode(newMode);
    // Refetch data when switching modes to ensure we have the latest audio data
    await refetchStorySegments();
  };

  // Enhanced story loader with callback
  const loadExistingStoryWithCallback = async (storyId: string) => {
    console.log('📖 Attempting to load existing story:', storyId);
    
    const success = await loadExistingStory(
      storyId, 
      setAllStorySegments, 
      setCurrentStorySegment, 
      setSegmentCount, 
      setViewMode
    );
    
    setStoryLoaded(success);
    console.log('📖 Story load result:', { storyId, success });
    return success;
  };

  // Load existing story segments if available, or start new story generation
  useEffect(() => {
    console.log('🔍 useEffect for story loading:', { 
      id, 
      isValidId: isValidUUID(id), 
      isInitialLoad, 
      prompt, 
      hasCurrentSegment: !!currentStorySegment,
      storyLoaded
    });

    const handleStoryFlow = async () => {
      if (id && isValidUUID(id)) {
        // Try to load existing story first
        const loaded = await loadExistingStoryWithCallback(id);
        await fetchStoryData(id);
        
        // If no existing story was loaded but we have a prompt, start generation
        if (!loaded && isInitialLoad && prompt && !currentStorySegment) {
          console.log('🚀 No existing story found, starting initial generation for prompt:', prompt);
          showConfirmation('start');
          setIsInitialLoad(false);
        }
      } else if (isInitialLoad && prompt && !currentStorySegment) {
        // Fallback for invalid IDs with prompts
        console.log('🚀 Starting initial story generation for prompt:', prompt);
        showConfirmation('start');
        setIsInitialLoad(false);
      }
    };

    handleStoryFlow();
  }, [id, isInitialLoad, prompt, currentStorySegment]);

  return {
    // State
    currentStorySegment,
    allStorySegments,
    segmentCount,
    maxSegments,
    skipImage,
    skipAudio,
    audioPlaying,
    error,
    showHistory,
    viewMode,
    
    // Story data
    storyData,
    
    // Story generation state
    storyGeneration,
    apiUsageCount,
    showCostDialog,
    pendingAction,
    pendingParams,
    
    // URL params
    genre,
    prompt,
    characterName,
    
    // Actions
    setSkipImage,
    setSkipAudio,
    setAudioPlaying,
    setError,
    setShowHistory,
    setViewMode: handleViewModeChange, // Use the enhanced version that refetches data
    setShowCostDialog,
    showConfirmation,
    confirmGeneration: handleConfirmGeneration,
    handleChoiceSelect,
    handleFinishStory: handleStoryFinish,
    refreshStoryData, // New function for audio generation callbacks
    
    // Navigation
    navigate
  };
};

// Export the StorySegment type for use in components
export type { StorySegment } from './useStoryDisplay/types';
