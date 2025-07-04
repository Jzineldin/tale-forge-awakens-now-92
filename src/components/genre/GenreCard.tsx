
import React, { useState } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

interface Genre {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  image: string;
}

interface GenreCardProps {
  genre: Genre;
  isSelected: boolean;
  onSelect: (genreId: string) => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, isSelected, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card
      className={`
        relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl
        aspect-[3/2] overflow-hidden
        ${isSelected 
          ? 'border-2 border-amber-400 shadow-2xl shadow-amber-400/20' 
          : 'border border-slate-600 hover:border-amber-400/60'
        }
        backdrop-blur-sm
      `}
      onClick={() => onSelect(genre.id)}
    >
      {/* Background Image */}
      {!imageError && (
        <img
          src={genre.image}
          alt={genre.title}
          className={`
            absolute inset-0 w-full h-full object-cover transition-all duration-700
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            group-hover:scale-110
          `}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Fallback gradient background */}
      {imageError && (
        <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient}`} />
      )}
      
      {/* Enhanced dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/95" />

      {/* Content positioned at top with white text for better visibility */}
      <div className="absolute top-0 left-0 right-0 p-6 text-left z-10">
        <CardTitle className="font-serif mb-2 text-lg text-white" style={{
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.9), 0 4px 8px rgba(0, 0, 0, 0.7)'
        }}>
          {genre.title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed line-clamp-2 text-white" style={{
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), 0 4px 6px rgba(0, 0, 0, 0.6)',
          opacity: '0.95'
        }}>
          {genre.description}
        </CardDescription>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-amber-400/10 border-2 border-amber-400 animate-pulse" />
      )}
    </Card>
  );
};

export default GenreCard;
