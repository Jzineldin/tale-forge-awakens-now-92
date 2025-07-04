
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'taleforge_temp_stories';
const EXPIRATION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface TempStory {
  id: string;
  timestamp: number;
  title: string;
  description?: string;
  story_mode?: string;
  content?: string;
  segments?: any[];
  created_at: string;
}

/**
 * Saves a story to local storage with a timestamp.
 */
export const saveTempStory = (storyData: Omit<TempStory, 'id' | 'timestamp'>): string => {
  if (typeof window === 'undefined') return '';

  const id = uuidv4();
  const timestamp = new Date().getTime();
  const storedStories = getTempStories(false);

  const newStory: TempStory = {
    id,
    timestamp,
    created_at: new Date().toISOString(),
    ...storyData
  };

  storedStories.push(newStory);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedStories));
  
  return id;
};

/**
 * Retrieves valid (non-expired) stories from local storage.
 */
export const getTempStories = (cleanup = true): TempStory[] => {
  if (typeof window === 'undefined') return [];

  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  let stories: TempStory[] = storedData ? JSON.parse(storedData) : [];
  const now = new Date().getTime();

  // Filter out expired stories
  const validStories = stories.filter(story => {
    if (story.timestamp) {
      return (now - story.timestamp) < EXPIRATION_DURATION_MS;
    }
    return true;
  });

  if (cleanup && validStories.length !== stories.length) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(validStories));
  }

  return validStories;
};

/**
 * Removes a specific story from local storage.
 */
export const removeTempStory = (storyId: string): void => {
  if (typeof window === 'undefined') return;
  
  const storedStories = getTempStories(false);
  const updatedStories = storedStories.filter(story => story.id !== storyId);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStories));
};

/**
 * Clears all temporary stories from local storage.
 */
export const clearAllTempStories = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

/**
 * Gets the number of days until a story expires.
 */
export const getDaysUntilExpiration = (story: TempStory): number => {
  if (!story.timestamp) return 7;
  
  const now = new Date().getTime();
  const elapsed = now - story.timestamp;
  const remaining = EXPIRATION_DURATION_MS - elapsed;
  
  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
};

/**
 * Checks if stories are about to expire (within 24 hours).
 */
export const hasStoriesAboutToExpire = (): boolean => {
  const stories = getTempStories();
  return stories.some(story => getDaysUntilExpiration(story) <= 1);
};
