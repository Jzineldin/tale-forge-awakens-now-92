
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Play, Pause, X, Eye } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-slate-600 z-50 flex flex-col">
      {/* Header - Improved visibility */}
      <div className="flex items-center justify-between p-4 bg-slate-800/95 border-b border-slate-400/50 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayback}
            className="text-white hover:bg-white/20 border border-white/30"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <span className="text-white text-lg font-semibold">
            Chapter {currentSlide + 1} of {segments.length}
          </span>
          {isPlaying && (
            <span className="text-amber-300 text-sm animate-pulse font-medium">
              ● PLAYING
            </span>
          )}
        </div>
        
        {/* Prominent Exit Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onClose}
          className="text-white hover:bg-red-600 bg-red-500/30 border-2 border-red-400 hover:border-red-300 transition-all duration-200 shadow-lg font-bold text-lg px-6"
        >
          <X className="h-7 w-7 font-bold mr-2" />
          EXIT
        </Button>
      </div>

      {/* Main slide area - Much lighter background */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-500">
        <div className="max-w-5xl w-full">
          <Card className="bg-white/95 border-slate-300 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              {/* Image */}
              {currentSegment.image_url ? (
                <div className="mb-6">
                  <img
                    src={currentSegment.image_url}
                    alt={`Story chapter ${currentSlide + 1}`}
                    className="w-full max-h-80 sm:max-h-96 object-contain rounded-lg shadow-lg border border-slate-200"
                    onError={(e) => {
                      console.warn('Image failed to load:', currentSegment.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                // Placeholder for missing images - Much lighter
                <div className="mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center h-64 sm:h-80 border-2 border-slate-300 shadow-inner">
                  <div className="text-center text-slate-700">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-70" />
                    <p className="text-lg font-semibold">Chapter {currentSlide + 1}</p>
                    <p className="text-sm opacity-70">Image generating...</p>
                  </div>
                </div>
              )}
              
              {/* Text - Dark text on light background */}
              <div className="text-slate-800 space-y-4">
                <p className="text-lg sm:text-xl leading-relaxed font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {currentSegment.segment_text}
                </p>
                
                {/* Choice indicator if available */}
                {currentSegment.triggering_choice_text && (
                  <div className="mt-4 pt-4 border-t border-slate-300">
                    <p className="text-base text-blue-700 italic font-medium">
                      → Choice made: {currentSegment.triggering_choice_text}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Controls - Improved contrast */}
      <div className="flex items-center justify-between p-4 bg-slate-800/95 border-t border-slate-400/50 backdrop-blur-sm shadow-lg">
        <Button
          variant="ghost"
          onClick={prevSlide}
          className="text-white hover:bg-white/20 flex items-center gap-2 border border-white/30 px-4 py-2"
          disabled={segments.length <= 1}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline font-medium">Previous</span>
        </Button>

        {/* Slide indicators */}
        <div className="flex gap-2 max-w-md overflow-x-auto">
          {segments.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200 flex-shrink-0 border",
                index === currentSlide 
                  ? "bg-amber-400 scale-125 border-amber-300" 
                  : "bg-white/50 hover:bg-white/70 border-white/30"
              )}
            />
          ))}
          {segments.length > 10 && (
            <span className="text-white/70 text-sm font-medium">+{segments.length - 10}</span>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={nextSlide}
          className="text-white hover:bg-white/20 flex items-center gap-2 border border-white/30 px-4 py-2"
          disabled={segments.length <= 1}
        >
          <span className="hidden sm:inline font-medium">Next</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Audio player - Fixed at bottom with better styling */}
      {fullStoryAudioUrl && (
        <div className="p-4 bg-slate-800/95 border-t border-slate-400/50 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
            <AudioPlayer src={fullStoryAudioUrl} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StorySlideshow;
