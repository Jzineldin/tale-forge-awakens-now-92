
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, Pause, X, Maximize2, Eye, SkipForward, SkipBack } from 'lucide-react';
import { StorySegmentRow } from '@/types/stories';
import AudioPlayer from '@/components/AudioPlayer';
import { cn } from '@/lib/utils';

interface StorySlideshowProps {
  segments: StorySegmentRow[];
  fullStoryAudioUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

const StorySlideshow: React.FC<StorySlideshowProps> = ({ 
  segments, 
  fullStoryAudioUrl, 
  isOpen, 
  onClose 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Auto-advance slides when playing (sync with audio or default timing)
  useEffect(() => {
    if (!isPlaying || !autoAdvance || segments.length <= 1) return;
    
    // Calculate timing based on text length (approximate reading time)
    const currentSegment = segments[currentSlide];
    const wordCount = currentSegment?.segment_text?.split(' ').length || 100;
    const readingTime = Math.max(5000, wordCount * 200); // Minimum 5 seconds, ~200ms per word
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % segments.length;
        // If we've completed a full cycle, pause the slideshow
        if (nextSlide === 0 && prev === segments.length - 1) {
          setIsPlaying(false);
        }
        return nextSlide;
      });
    }, readingTime);

    return () => clearInterval(interval);
  }, [isPlaying, autoAdvance, segments.length, currentSlide]);

  // Auto-start slideshow when audio is available
  useEffect(() => {
    if (isOpen && fullStoryAudioUrl && !isPlaying) {
      console.log('🎬 Auto-starting slideshow with audio');
      setIsPlaying(true);
    }
  }, [isOpen, fullStoryAudioUrl]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % segments.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + segments.length) % segments.length);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!isOpen || segments.length === 0) return null;

  const currentSegment = segments[currentSlide];
  const hasImages = segments.some(s => s.image_url);

  return (
    <div className="fixed inset-0 bg-black/98 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/70 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayback}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <span className="text-white text-sm font-medium">
            Chapter {currentSlide + 1} of {segments.length}
          </span>
          {isPlaying && (
            <span className="text-amber-400 text-xs animate-pulse">
              ● PLAYING
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main slide area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-5xl w-full">
          <Card className="bg-black/40 backdrop-blur-lg border-gray-700/50 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              {/* Image */}
              {currentSegment.image_url ? (
                <div className="mb-6">
                  <img
                    src={currentSegment.image_url}
                    alt={`Story chapter ${currentSlide + 1}`}
                    className="w-full max-h-80 sm:max-h-96 object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      console.warn('Image failed to load:', currentSegment.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                // Placeholder for missing images
                <div className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center h-64 sm:h-80">
                  <div className="text-center text-slate-400">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chapter {currentSlide + 1}</p>
                    <p className="text-xs opacity-70">Image generating...</p>
                  </div>
                </div>
              )}
              
              {/* Text */}
              <div className="text-white space-y-4">
                <p className="text-base sm:text-lg leading-relaxed font-medium">
                  {currentSegment.segment_text}
                </p>
                
                {/* Choice indicator if available */}
                {currentSegment.triggering_choice_text && (
                  <div className="mt-4 pt-4 border-t border-gray-600/50">
                    <p className="text-sm text-blue-300 italic">
                      → Choice made: {currentSegment.triggering_choice_text}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between p-4 bg-black/70 backdrop-blur-sm border-t border-gray-800">
        <Button
          variant="ghost"
          onClick={prevSlide}
          className="text-white hover:bg-white/20 flex items-center gap-2"
          disabled={segments.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Slide indicators */}
        <div className="flex gap-1 sm:gap-2 max-w-md overflow-x-auto">
          {segments.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 flex-shrink-0",
                index === currentSlide 
                  ? "bg-white scale-125" 
                  : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
          {segments.length > 10 && (
            <span className="text-white/50 text-xs">+{segments.length - 10}</span>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={nextSlide}
          className="text-white hover:bg-white/20 flex items-center gap-2"
          disabled={segments.length <= 1}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Audio player - Fixed at bottom */}
      {fullStoryAudioUrl && (
        <div className="p-4 bg-black/80 backdrop-blur-sm border-t border-gray-800">
          <div className="max-w-2xl mx-auto">
            <AudioPlayer src={fullStoryAudioUrl} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StorySlideshow;
