
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { StorySegment } from '@/hooks/useStoryDisplay/types';

interface StorySegmentsDisplayProps {
  segments: StorySegment[];
  storyTitle?: string;
  currentChapterIndex?: number;
  onChapterChange?: (index: number) => void;
}

const StorySegmentsDisplay: React.FC<StorySegmentsDisplayProps> = ({
  segments,
  storyTitle = 'Your Complete Story',
  currentChapterIndex = 0,
  onChapterChange = () => {}
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image failed to load:', e.currentTarget.src);
    e.currentTarget.style.display = 'none';
    const placeholder = e.currentTarget.nextSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image loaded successfully:', e.currentTarget.src);
    const placeholder = e.currentTarget.nextSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  };

  const isValidImageUrl = (url: string | undefined) => {
    return url && 
           url.trim() !== '' && 
           url !== '/placeholder.svg' && 
           !url.includes('placeholder');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-amber-400" />
          <h2 className="text-2xl font-serif text-amber-300">{storyTitle}</h2>
        </div>
        <p className="text-gray-400">Your complete adventure in {segments.length} segments</p>
      </div>

      {segments.map((segment, index) => (
        <Card key={segment.id} className="bg-slate-800/80 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-300 text-lg font-serif">
              Chapter {index + 1}
              {segment.audio_url && (
                <span className="ml-2 text-sm text-amber-400/70">🎵</span>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Section */}
              <div className="lg:col-span-1">
                <div className="relative w-full h-64">
                  {isValidImageUrl(segment.image_url) ? (
                    <>
                      <img 
                        src={segment.image_url} 
                        alt={`Story segment ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg border border-amber-500/20 shadow-lg"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        loading="lazy"
                      />
                      {/* Fallback placeholder - hidden by default, shown when image fails */}
                      <div 
                        className="absolute inset-0 w-full h-64 bg-slate-700/50 border-2 border-dashed border-amber-500/30 rounded-lg flex-col items-center justify-center hidden"
                        style={{ display: 'none' }}
                      >
                        <AlertCircle className="h-8 w-8 text-amber-400/70 mb-2" />
                        <p className="text-amber-300/70 text-sm text-center px-4">
                          Image no longer available
                        </p>
                        <p className="text-amber-400/50 text-xs text-center px-4 mt-1">
                          Chapter {index + 1}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-64 bg-slate-700/50 border-2 border-dashed border-amber-500/30 rounded-lg flex flex-col items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-amber-400/50 mb-2" />
                      <p className="text-amber-300/70 text-sm">No image available</p>
                      <p className="text-amber-400/50 text-xs mt-1">Chapter {index + 1}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Text Section */}
              <div className="lg:col-span-2 space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-100 text-lg leading-relaxed font-serif whitespace-pre-wrap">
                    {segment.segment_text}
                  </p>
                </div>
                
                {segment.triggering_choice_text && (
                  <div className="bg-slate-700/50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-semibold text-sm">Choice Made:</span>
                      <span className="text-amber-300 text-sm italic">
                        "{segment.triggering_choice_text}"
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StorySegmentsDisplay;
