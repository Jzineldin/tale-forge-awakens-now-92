
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const GenreHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default GenreHeader;
