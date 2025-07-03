
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
}

const genres: Genre[] = [
  {
    id: 'child-adapted',
    title: '👶 Child Adapted',
    description: 'Family-friendly adventures perfect for young minds',
    icon: Baby,
    gradient: 'from-pink-500 to-rose-400'
  },
  {
    id: 'horror-story',
    title: '👻 Horror Story',
    description: 'Supernatural thrills and spine-chilling tales',
    icon: Ghost,
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'educational',
    title: '📚 Educational',
    description: 'Learning through engaging storytelling',
    icon: Book,
    gradient: 'from-green-500 to-emerald-400'
  },
  {
    id: 'epic-fantasy',
    title: '🏰 Epic Fantasy',
    description: 'Dragons, magic, and mystical kingdoms',
    icon: Castle,
    gradient: 'from-amber-500 to-orange-400'
  },
  {
    id: 'sci-fi-thriller',
    title: '🚀 Sci-Fi Thriller',
    description: 'Space adventures and futuristic technology',
    icon: Rocket,
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'mystery',
    title: '🕵️ Mystery',
    description: 'Crime solving and thrilling investigations',
    icon: Search,
    gradient: 'from-slate-500 to-gray-400'
  },
  {
    id: 'romantic-drama',
    title: '💕 Romantic Drama',
    description: 'Love stories and emotional relationships',
    icon: Heart,
    gradient: 'from-red-500 to-pink-400'
  },
  {
    id: 'adventure-quest',
    title: '🗺️ Adventure Quest',
    description: 'Exploration and thrilling discoveries',
    icon: Map,
    gradient: 'from-teal-500 to-green-400'
  }
];

const CreateGenre: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const navigate = useNavigate();

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
  };

  const handleContinue = () => {
    if (selectedGenre) {
      navigate(`/create/starting-point?genre=${selectedGenre}`);
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
            Choose Your <span className="text-amber-400">Genre</span>
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
                cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl
                ${selectedGenre === genre.id 
                  ? 'border-2 border-amber-400 shadow-2xl shadow-amber-400/20 bg-slate-800/90' 
                  : 'border border-slate-600 hover:border-amber-400/60 bg-slate-800/70'
                }
                backdrop-blur-sm
              `}
              onClick={() => handleGenreSelect(genre.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${genre.gradient} flex items-center justify-center mb-4`}>
                  <genre.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-lg font-serif">
                  {genre.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-sm leading-relaxed">
                  {genre.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedGenre}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Choose Starting Point
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGenre;
