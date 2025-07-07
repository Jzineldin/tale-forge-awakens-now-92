
import React from 'react';
import StoryImage from '@/components/story-viewer/StoryImage';

interface StoryImageSectionProps {
  imageUrl?: string;
  imageGenerationStatus?: string;
  segmentId?: string;
  onRetry?: () => void;
}

const StoryImageSection: React.FC<StoryImageSectionProps> = ({
  imageUrl,
  imageGenerationStatus,
  segmentId,
  onRetry
}) => {
  console.log('[StoryImageSection] Rendering with:', {
    imageUrl,
    imageGenerationStatus,
    hasImageUrl: !!imageUrl,
    segmentId
  });

  return (
    <div className="story-image-section w-full">
      <StoryImage
        imageUrl={imageUrl}
        imageGenerationStatus={imageGenerationStatus}
        altText="AI generated story illustration"
        className="w-full max-w-4xl h-80 md:h-96 rounded-lg shadow-lg mx-auto"
        segmentId={segmentId}
        onRetry={onRetry}
      />
    </div>
  );
};

export default StoryImageSection;
