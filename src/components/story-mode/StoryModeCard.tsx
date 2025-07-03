
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { StoryMode } from '@/data/storyModes';

interface StoryModeCardProps {
  mode: StoryMode;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

const StoryModeCard: React.FC<StoryModeCardProps> = ({ 
  mode, 
  isSelected, 
  onSelect, 
  disabled 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`Image loaded successfully: ${mode.name}`);
    console.log(`Image src: ${mode.image}`);
    setImageLoaded(true);
    e.currentTarget.classList.add('loaded');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image for ${mode.name}: ${mode.image}`);
    console.error(`Image element:`, e.currentTarget);
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div
      className={cn(
        "story-card-landscape relative w-full aspect-[4/3] cursor-pointer transition-all duration-300 ease-out",
        "bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm",
        "rounded-xl border border-white/20 shadow-2xl overflow-hidden",
        "transform perspective-900 rotateX-5",
        "hover:rotateX-0 hover:translateY-[-4px] hover:shadow-3xl hover:shadow-amber-500/20",
        "group transform-gpu",
        isSelected && "ring-2 ring-amber-400 shadow-lg shadow-amber-400/25 rotateX-0 translateY-[-4px]",
        disabled && "pointer-events-none opacity-50",
        !disabled && "hover:border-amber-400/40"
      )}
      onClick={() => !disabled && onSelect()}
    >
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400"></div>
        </div>
      )}

      {/* Background Image */}
      {!imageError && (
        <img
          src={mode.image}
          alt={mode.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      {/* Fallback gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
        mode.gradient,
        imageError || !imageLoaded ? "opacity-100" : "opacity-0"
      )} />

      {/* Badge (icon) */}
      <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
        <mode.icon className="h-4 w-4 text-white" />
      </div>
      
      {/* Content with enhanced text shadows for readability */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <h3 className="text-base font-bold text-white mb-1 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
          {mode.name}
        </h3>
        <p className="text-xs text-gray-200 leading-relaxed drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
          {mode.description}
        </p>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-amber-400/10 border-2 border-amber-400 rounded-xl animate-pulse" />
      )}
    </div>
  );
};

export default StoryModeCard;
