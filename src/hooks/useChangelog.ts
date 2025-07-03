
import { useCallback, useEffect } from 'react';
import ChangelogManager from '@/utils/changelogManager';

interface ChangeEntry {
  type: 'feature' | 'improvement' | 'fix';
  description: string;
}

export const useChangelog = () => {
  const logChange = useCallback((change: ChangeEntry) => {
    ChangelogManager.logChanges([change]);
  }, []);

  const logChanges = useCallback((changes: ChangeEntry[]) => {
    ChangelogManager.logChanges(changes);
  }, []);

  const logFeature = useCallback((description: string) => {
    logChange({ type: 'feature', description });
  }, [logChange]);

  const logImprovement = useCallback((description: string) => {
    logChange({ type: 'improvement', description });
  }, [logChange]);

  const logFix = useCallback((description: string) => {
    logChange({ type: 'fix', description });
  }, [logChange]);

  // Log all recent improvements on initialization
  useEffect(() => {
    const hasLoggedRecentImprovements = localStorage.getItem('taleforge-recent-improvements-logged');
    if (!hasLoggedRecentImprovements) {
      logChanges([
        { type: 'feature', description: 'Added persistent audio player that maintains state across all chapter navigation in story creation mode' },
        { type: 'improvement', description: 'Enhanced audio experience - generated audio now persists when switching between chapters and never disappears' },
        { type: 'improvement', description: 'Added responsive mobile-first genre selection with dropdown for devices ≤768px while maintaining desktop grid layout' },
        { type: 'improvement', description: 'Created dedicated responsive CSS system with proper media queries for seamless genre selection across all devices' },
        { type: 'improvement', description: 'Ensured state synchronization between desktop grid and mobile dropdown genre selection interfaces' },
        { type: 'improvement', description: 'Refocused landing page on waitlist signup by hiding authentication buttons and streamlining user flow' },
        { type: 'improvement', description: 'Updated hero section CTAs to prioritize immediate story creation and waitlist engagement over account creation' },
        { type: 'improvement', description: 'Maintained full local app functionality while directing new users toward waitlist for future features' },
        { type: 'fix', description: 'Fixed story player audio generation to be user-triggered instead of automatic, preventing unwanted audio generation' },
        { type: 'improvement', description: 'Enhanced audio player controls with better user feedback and manual audio generation options' },
        { type: 'improvement', description: 'Improved audio generation UX with clear generate buttons and better status indicators' },
        { type: 'feature', description: 'Added comprehensive audio playlist functionality that tracks all generated audio across story segments' },
        { type: 'improvement', description: 'Enhanced chapter navigation to work seamlessly with persistent audio playback' },
        { type: 'fix', description: 'Resolved audio disappearing issue when switching between story chapters - audio now persists throughout entire story experience' },
      ]);
      localStorage.setItem('taleforge-recent-improvements-logged', 'true');
    }
  }, [logChanges]);

  return {
    logChange,
    logChanges,
    logFeature,
    logImprovement,
    logFix,
  };
};
