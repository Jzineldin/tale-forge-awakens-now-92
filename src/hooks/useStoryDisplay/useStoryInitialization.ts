import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useStoryLoader } from './useStoryLoader';
import { StorySegment } from './types';
import { isValidUUID } from './utils';

export const useStoryInitialization = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [storyLoaded, setStoryLoaded] = useState(false);

  // Get parameters from URL
  const genre = searchParams.get('genre') || searchParams.get('mode') || 'fantasy';
  const prompt = searchParams.get('prompt') || '';
  const characterName = searchParams.get('characterName') || '';

  return {
    id,
    genre,
    prompt,
    characterName,
    isInitialLoad,
    setIsInitialLoad,
    storyLoaded,
    setStoryLoaded,
  };
};