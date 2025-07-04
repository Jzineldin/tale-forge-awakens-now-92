import { useEffect } from 'react';
import { useStoryLoader } from './useStoryLoader';
import { StorySegment } from './types';
import { isValidUUID } from './utils';

interface UseStoryInitializationLogicProps {
  id?: string;
  prompt: string;
  currentStorySegment: StorySegment | null;
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
  storyLoaded: boolean;
  setStoryLoaded: (value: boolean) => void;
  setAllStorySegments: (segments: StorySegment[]) => void;
  setCurrentStorySegment: (segment: StorySegment | null) => void;
  setSegmentCount: (count: number) => void;
  setViewMode: (mode: 'create' | 'player') => void;
  fetchStoryData: (id: string) => Promise<void>;
  showConfirmation: (action: 'start' | 'choice', choice?: string) => void;
}

export const useStoryInitializationLogic = ({
  id,
  prompt,
  currentStorySegment,
  isInitialLoad,
  setIsInitialLoad,
  storyLoaded,
  setStoryLoaded,
  setAllStorySegments,
  setCurrentStorySegment,
  setSegmentCount,
  setViewMode,
  fetchStoryData,
  showConfirmation,
}: UseStoryInitializationLogicProps) => {
  const { loadExistingStory } = useStoryLoader();

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
};