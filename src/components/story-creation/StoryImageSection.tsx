
import React from 'react';
import { Loader2, ImageIcon, AlertCircle } from 'lucide-react';

interface StoryImageSectionProps {
  imageUrl?: string | null;
  imageGenerationStatus?: string;
}

const StoryImageSection: React.FC<StoryImageSectionProps> = ({
  imageUrl,
  imageGenerationStatus
}) => {
  console.log('[StoryImageSection] Debug info:', {
    imageUrl: imageUrl || 'null/undefined',
    imageGenerationStatus,
    hasImageUrl: !!imageUrl,
    isPlaceholder: imageUrl === '/placeholder.svg'
  });

  const isValidImageUrl = imageUrl && 
                         imageUrl !== '/placeholder.svg' && 
                         imageUrl.trim() !== '' &&
                         !imageUrl.includes('placeholder');
  
  const isGenerating = imageGenerationStatus === 'generating' || imageGenerationStatus === 'pending';
  const isCompleted = imageGenerationStatus === 'completed';
  const isFailed = imageGenerationStatus === 'failed';

  // Show spinner when generating and no valid image
  if (isGenerating && !isValidImageUrl) {
    return (
      <div className="story-image-section w-full">
        <div className="w-full max-w-4xl h-80 md:h-96 rounded-lg border-2 border-dashed border-amber-500/30 bg-slate-800/50 flex flex-col items-center justify-center mx-auto">
          <Loader2 className="h-12 w-12 animate-spin text-amber-400 mb-4" />
          <p className="text-amber-300 text-lg">Creating your story image...</p>
          <p className="text-amber-300/70 text-sm mt-2">This may take 30-60 seconds</p>
        </div>
      </div>
    );
  }

  // Show error state for failed generation
  if (isFailed) {
    return (
      <div className="story-image-section w-full">
        <div className="w-full max-w-4xl h-80 md:h-96 rounded-lg border-2 border-dashed border-red-500/30 bg-red-900/20 flex flex-col items-center justify-center mx-auto">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-300 text-lg mb-2">Image generation failed</p>
          <p className="text-red-300/70 text-sm text-center">The story continues without an image</p>
        </div>
      </div>
    );
  }

  // Show the actual image if we have a valid URL
  if (isValidImageUrl) {
    return (
      <div className="story-image-section w-full">
        <img
          src={imageUrl}
          alt="AI generated story illustration"
          className="w-full max-w-4xl h-80 md:h-96 rounded-lg border border-amber-500/20 object-cover shadow-lg mx-auto"
          onError={(e) => {
            console.error('[StoryImageSection] Failed to load image:', imageUrl);
          }}
        />
      </div>
    );
  }

  // Default placeholder when no image and not generating
  return (
    <div className="story-image-section w-full">
      <div className="w-full max-w-4xl h-80 md:h-96 rounded-lg border-2 border-dashed border-amber-500/30 bg-slate-800/50 flex flex-col items-center justify-center mx-auto">
        <ImageIcon className="h-16 w-16 text-amber-400/50 mb-4" />
        <p className="text-amber-300/70 text-lg">Story Image</p>
        <p className="text-amber-300/50 text-sm mt-2">No image for this segment</p>
      </div>
    </div>
  );
};

export default StoryImageSection;
