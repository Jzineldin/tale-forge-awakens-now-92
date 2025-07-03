
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Baby, 
  Ghost, 
  Book, 
  Castle, 
  Rocket, 
  Search, 
  Heart, 
  Map,
  ArrowRight,
  Home
} from 'lucide-react';

interface Genre {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  image: string;
}

const genres: Genre[] = [
  {
    id: 'child-adapted',
    title: '👶 Child Adapted',
    description: 'Family-friendly adventures perfect for young minds',
    icon: Baby,
    gradient: 'from-pink-500 to-rose-400',
    image: '/images/child-adapted-story.png'
  },
  {
    id: 'horror-story',
    title: '👻 Horror Story',
    description: 'Supernatural thrills and spine-chilling tales',
    icon: Ghost,
    gradient: 'from-purple-600 to-indigo-600',
    image: '/images/horror-story.png'
  },
  {
    id: 'educational',
    title: '📚 Educational',
    description: 'Learning through engaging storytelling',
    icon: Book,
    gradient: 'from-green-500 to-emerald-400',
    image: '/images/educational-adventure.png'
  },
  {
    id: 'epic-fantasy',
    title: '🏰 Epic Fantasy',
    description: 'Dragons, magic, and mystical kingdoms',
    icon: Castle,
    gradient: 'from-amber-500 to-orange-400',
    image: '/images/epic-fantasy.png'
  },
  {
    id: 'sci-fi-thriller',
    title: '🚀 Sci-Fi Thriller',
    description: 'Space adventures and futuristic technology',
    icon: Rocket,
    gradient: 'from-blue-500 to-cyan-400',
    image: '/images/sci-fi-thriller.png'
  },
  {
    id: 'mystery',
    title: '🕵️ Mystery',
    description: 'Crime solving and thrilling investigations',
    icon: Search,
    gradient: 'from-slate-500 to-gray-400',
    image: '/images/mystery-detective.png'
  },
  {
    id: 'romantic-drama',
    title: '💕 Romantic Drama',
    description: 'Love stories and emotional relationships',
    icon: Heart,
    gradient: 'from-red-500 to-pink-400',
    image: '/images/romantic-drama.png'
  },
  {
    id: 'adventure-quest',
    title: '🗺️ Adventure Quest',
    description: 'Exploration and thrilling discoveries',
    icon: Map,
    gradient: 'from-teal-500 to-green-400',
    image: '/images/adventure-quest.png'
  }
];

const CreateGenre: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const navigate = useNavigate();

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
  };

  const handleNext = () => {
    if (selectedGenre) {
      navigate(`/create/prompt?genre=${selectedGenre}`);
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-900"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/images/Flux_Dev_Lonely_astronaut_sitting_on_a_pile_of_books_in_space__0.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 text-white hover:text-amber-400"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
            Choose Your <span className="text-amber-400">Adventure</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect genre for your personalized story adventure
          </p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {genres.map((genre) => (
            <Card
              key={genre.id}
              className={`
                relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl
                aspect-[3/2] overflow-hidden
                ${selectedGenre === genre.id 
                  ? 'border-2 border-amber-400 shadow-2xl shadow-amber-400/20' 
                  : 'border border-slate-600 hover:border-amber-400/60'
                }
                backdrop-blur-sm
              `}
              onClick={() => handleGenreSelect(genre.id)}
            >
              {/* Background Image */}
              <img
                src={genre.image}
                alt={genre.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Fallback gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient}`} />
              
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Icon badge */}
              <div className="absolute top-4 right-4 p-3 bg-black/70 backdrop-blur-md rounded-full border border-white/20 z-10">
                <genre.icon className="h-5 w-5 text-amber-400" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left z-10">
                <CardTitle className="text-white text-lg font-serif mb-2 drop-shadow-lg">
                  {genre.title}
                </CardTitle>
                <CardDescription className="text-gray-200 text-sm leading-relaxed drop-shadow-md line-clamp-2 opacity-90">
                  {genre.description}
                </CardDescription>
              </div>

              {/* Selection indicator */}
              {selectedGenre === genre.id && (
                <div className="absolute inset-0 bg-amber-400/10 border-2 border-amber-400 animate-pulse" />
              )}
            </Card>
          ))}
        </div>

        {/* Next Button */}
        <div className="text-center">
          <Button
            onClick={handleNext}
            disabled={!selectedGenre}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGenre;
