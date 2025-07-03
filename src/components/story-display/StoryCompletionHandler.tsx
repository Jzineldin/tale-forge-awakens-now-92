
import React from 'react';
import UnifiedStoryCompletion from '@/components/story-viewer/UnifiedStoryCompletion';
import { StorySegment } from '@/hooks/useStoryDisplay/types';
import { convertStorySegmentsToRows } from '@/utils/storyTypeConversion';

interface StoryCompletionHandlerProps {
  isStoryCompleted: boolean;
  storyId?: string;
  allStorySegments: StorySegment[];
  fullStoryAudioUrl?: string | null;
  audioGenerationStatus?: string;
}

const StoryCompletionHandler: React.FC<StoryCompletionHandlerProps> = ({
  isStoryCompleted,
  storyId,
  allStorySegments,
  fullStoryAudioUrl,
  audioGenerationStatus
}) => {
  if (!isStoryCompleted || !storyId) {
    return null;
  }

  const segmentRows = convertStorySegmentsToRows(allStorySegments);

  return (
    <UnifiedStoryCompletion
      storyId={storyId}
      segments={segmentRows}
      fullStoryAudioUrl={fullStoryAudioUrl}
      audioGenerationStatus={audioGenerationStatus}
    />
  );
};

export default StoryCompletionHandler;
