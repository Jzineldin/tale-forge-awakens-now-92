
import React from 'react';
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
      <img
        src={genre.image}
        alt={genre.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Fallback gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient}`} />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90" />

      {/* Content positioned at top */}
      <div className="absolute top-0 left-0 right-0 p-6 text-left z-10">
        <CardTitle className="text-white text-lg font-serif mb-2 drop-shadow-lg">
          {genre.title}
        </CardTitle>
        <CardDescription className="text-gray-200 text-sm leading-relaxed drop-shadow-md line-clamp-2 opacity-90">
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
