
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

  const handleClose = () => {
    console.log('🎬 Slideshow close button clicked - closing slideshow and navigating to home');
    setIsPlaying(false);
    onClose();
    // Navigate to home
    window.location.href = '/';
  };

  if (!isOpen || segments.length === 0) return null;

  const currentSegment = segments[currentSlide];

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-slate-900"
      style={{
        background: `
          linear-gradient(rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98)),
          url('/images/Flux_Dev_Lonely_astronaut_sitting_on_a_pile_of_books_in_space__0.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header with SUPER PROMINENT exit button */}
      <div className="flex items-center justify-between p-4 bg-slate-800/95 border-b border-amber-500/30 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayback}
            className="text-white hover:bg-amber-500/20 border border-amber-500/30"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <span className="text-amber-200 text-sm font-medium bg-slate-700/50 px-3 py-1 rounded-full border border-amber-500/30">
            Chapter {currentSlide + 1} of {segments.length}
          </span>
          {isPlaying && (
            <span className="text-amber-400 text-xs animate-pulse bg-amber-900/30 px-2 py-1 rounded-full border border-amber-500/50">
              ● PLAYING
            </span>
          )}
        </div>
        
        {/* MASSIVE, IMPOSSIBLE TO MISS EXIT BUTTON */}
        <Button
          variant="outline"
          onClick={handleClose}
          className="text-white hover:text-red-100 bg-red-600/90 hover:bg-red-500 border-4 border-red-300 hover:border-red-200 px-8 py-4 text-xl font-bold transition-all duration-200 shadow-2xl hover:shadow-red-500/50 hover:scale-110 animate-pulse"
          style={{
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
            fontSize: '18px',
            minWidth: '200px',
            minHeight: '60px'
          }}
        >
          <X className="h-6 w-6 mr-3" />
          EXIT TO HOME
        </Button>
      </div>

      {/* Main slide area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-5xl w-full">
          <Card className="bg-slate-800/90 border-amber-500/30 shadow-2xl backdrop-blur-sm border-2">
            <CardContent className="p-6 sm:p-8">
              {/* Image */}
              {currentSegment.image_url ? (
                <div className="mb-6">
                  <img
                    src={currentSegment.image_url}
                    alt={`Story chapter ${currentSlide + 1}`}
                    className="w-full max-h-80 sm:max-h-96 object-contain rounded-lg shadow-lg border border-amber-500/20"
                    onError={(e) => {
                      console.warn('Image failed to load:', currentSegment.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                // Placeholder for missing images
                <div className="mb-6 bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-lg flex items-center justify-center h-64 sm:h-80 border border-amber-500/30">
                  <div className="text-center text-amber-200">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-70 text-amber-400" />
                    <p className="text-sm font-medium">Chapter {currentSlide + 1}</p>
                    <p className="text-xs opacity-70">✨ Image materializing...</p>
                  </div>
                </div>
              )}
              
              {/* Text */}
              <div className="text-slate-100 space-y-4">
                <p className="text-base sm:text-lg leading-relaxed font-medium">
                  {currentSegment.segment_text}
                </p>
                
                {/* Choice indicator if available */}
                {currentSegment.triggering_choice_text && (
                  <div className="mt-4 pt-4 border-t border-amber-500/30">
                    <p className="text-sm text-amber-300 italic">
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
      <div className="flex items-center justify-between p-4 bg-slate-800/95 border-t border-amber-500/30 backdrop-blur-sm shadow-lg">
        <Button
          variant="ghost"
          onClick={prevSlide}
          className="text-white hover:bg-amber-500/20 flex items-center gap-2 border border-amber-500/30"
          disabled={segments.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Slide indicators */}
        <div className="flex gap-1 sm:gap-2 max-w-md overflow-x-auto bg-slate-700/50 px-3 py-2 rounded-full border border-amber-500/20">
          {segments.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 flex-shrink-0",
                index === currentSlide 
                  ? "bg-amber-400 scale-125 shadow-lg shadow-amber-400/50" 
                  : "bg-amber-200/30 hover:bg-amber-200/50"
              )}
            />
          ))}
          {segments.length > 10 && (
            <span className="text-amber-200/50 text-xs ml-2">+{segments.length - 10}</span>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={nextSlide}
          className="text-white hover:bg-amber-500/20 flex items-center gap-2 border border-amber-500/30"
          disabled={segments.length <= 1}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Audio player - Fixed at bottom */}
      {fullStoryAudioUrl && (
        <div className="p-4 bg-slate-800/95 border-t border-amber-500/30 backdrop-blur-sm shadow-lg">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-700/50 border border-amber-500/20 rounded-lg p-3">
              <AudioPlayer src={fullStoryAudioUrl} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorySlideshow;
