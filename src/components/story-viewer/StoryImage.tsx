
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RotateCcw, ImageIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryImageProps {
    imageUrl?: string | null;
    imageGenerationStatus?: string;
    altText: string;
    className?: string;
}

const StoryImage: React.FC<StoryImageProps> = ({
    imageUrl,
    imageGenerationStatus,
    altText,
    className = ""
}) => {
    const [imageError, setImageError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [imageKey, setImageKey] = useState(0);

    console.log('[StoryImage] Debug info:', {
        imageUrl: imageUrl || 'null/undefined',
        imageGenerationStatus,
        hasImageUrl: !!imageUrl,
        imageUrlLength: imageUrl?.length || 0,
        isPlaceholder: imageUrl === '/placeholder.svg',
        imageError,
        retryCount
    });

    // Reset error state when imageUrl changes
    useEffect(() => {
        if (imageUrl && imageUrl !== '/placeholder.svg') {
            console.log('[StoryImage] Valid image URL changed, resetting error state');
            setImageError(false);
            setRetryCount(0);
            setImageKey(prev => prev + 1);
        }
    }, [imageUrl]);

    const handleRetry = () => {
        console.log('[StoryImage] Manual retry triggered');
        setImageError(false);
        setRetryCount(prev => prev + 1);
        setImageKey(prev => prev + 1);
    };

    const handleImageError = () => {
        console.error('[StoryImage] Failed to load image:', imageUrl);
        setImageError(true);
    };

    const handleImageLoad = () => {
        console.log('[StoryImage] Image loaded successfully:', imageUrl);
    };

    // Determine what to show based on the current state
    const isValidImageUrl = imageUrl && 
                           imageUrl !== '/placeholder.svg' && 
                           imageUrl.trim() !== '' &&
                           !imageUrl.includes('placeholder');
    const isGenerating = imageGenerationStatus === 'pending' || imageGenerationStatus === 'in_progress';
    const isCompleted = imageGenerationStatus === 'completed';
    const isFailed = imageGenerationStatus === 'failed';

    console.log('[StoryImage] Display decision:', {
        isValidImageUrl,
        isGenerating,
        isCompleted,
        isFailed,
        imageError,
        shouldShowSpinner: isGenerating && !isValidImageUrl,
        shouldShowImage: isValidImageUrl && !imageError,
        shouldShowError: isFailed || imageError,
        shouldShowPlaceholder: !isGenerating && !isValidImageUrl && !isFailed && !imageError
    });

    // Show spinner when generating and no valid image
    if (isGenerating && !isValidImageUrl) {
        return (
            <div className={`relative flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 aspect-square w-full ${className}`}>
                <div className="flex flex-col items-center space-y-2 text-slate-600">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm">Generating image...</p>
                    <p className="text-xs text-amber-600">Please wait...</p>
                </div>
            </div>
        );
    }

    // Show error state for failed generation or image load errors
    if (isFailed || imageError) {
        const isExpiredUrl = imageError && imageUrl?.includes('oaidalleapiprodscus');
        
        return (
            <div className={`relative flex items-center justify-center bg-red-50 border-2 border-red-200 aspect-square w-full ${className}`}>
                <div className="flex flex-col items-center space-y-3 text-red-600 p-4">
                    <AlertCircle className="h-8 w-8" />
                    <p className="text-sm text-center">
                        {isExpiredUrl 
                            ? 'Image URL has expired' 
                            : isFailed 
                                ? 'Image generation failed' 
                                : 'Failed to load image'
                        }
                    </p>
                    {isExpiredUrl && (
                        <p className="text-xs text-center text-slate-600">
                            AI-generated images expire after some time
                        </p>
                    )}
                    <Button 
                        onClick={handleRetry}
                        size="sm"
                        variant="outline"
                        className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                    >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // Show the actual image if we have a valid URL
    if (isValidImageUrl) {
        console.log('[StoryImage] Rendering actual image with key:', imageKey);
        return (
            <div className={`relative overflow-hidden border border-slate-200 aspect-square w-full ${className}`}>
                <img
                    key={`${imageUrl}-${imageKey}`}
                    src={imageUrl}
                    alt={altText}
                    className="absolute inset-0 w-full h-full object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="eager"
                />
                {/* Debug info overlay for development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs p-1 rounded">
                        Status: {imageGenerationStatus}
                    </div>
                )}
            </div>
        );
    }

    // Show placeholder when no image is available and not failed
    return (
        <div className={`relative flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 aspect-square w-full ${className}`}>
            <div className="flex flex-col items-center space-y-2 text-slate-500">
                <ImageIcon className="h-8 w-8" />
                <p className="text-sm">No image available</p>
                <p className="text-xs">Images skipped for this story</p>
            </div>
        </div>
    );
};

export default StoryImage;
