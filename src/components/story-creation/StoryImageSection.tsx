
import React from 'react';
import { ImageIcon } from 'lucide-react';

interface StoryImageSectionProps {
  imageUrl: string;
  imageGenerationStatus: string;
}

const StoryImageSection: React.FC<StoryImageSectionProps> = ({
  imageUrl,
  imageGenerationStatus
}) => {
  const hasRealImage = imageUrl && 
                      imageUrl !== '/placeholder.svg' && 
                      imageGenerationStatus === 'completed';

  const isImageGenerating = imageGenerationStatus === 'pending' || imageGenerationStatus === 'in_progress';

  return (
    <div className="story-image-section w-full">
      {hasRealImage ? (
        <img
          src={imageUrl}
          alt="AI generated story illustration"
          className="w-full max-w-4xl h-80 md:h-96 rounded-lg border border-amber-500/20 object-cover shadow-lg mx-auto"
        />
      ) : (
        <div className="w-full max-w-4xl h-80 md:h-96 rounded-lg border-2 border-dashed border-amber-500/30 bg-slate-800/50 flex flex-col items-center justify-center mx-auto">
          {isImageGenerating ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mb-4"></div>
              <p className="text-amber-300 text-lg">Creating your story image...</p>
              <p className="text-amber-300/70 text-sm mt-2">This may take 30-60 seconds</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-16 w-16 text-amber-400/50 mb-4" />
              <p className="text-amber-300/70 text-lg">Story Image</p>
              {imageGenerationStatus === 'failed' && (
                <p className="text-amber-300/50 text-sm mt-2">Image generation failed</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryImageSection;
