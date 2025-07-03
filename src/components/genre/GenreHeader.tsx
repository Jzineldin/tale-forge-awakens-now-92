
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const GenreHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-12 relative">
      <div className="absolute top-0 left-0 z-10">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-white hover:text-amber-400 hover:bg-white/10 transition-all duration-200"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
      
      <div className="pt-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif magical-glow-text">
          Choose Your <span className="magical-text">Adventure</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto" style={{
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
        }}>
          Select the perfect genre for your personalized story adventure
        </p>
      </div>
    </div>
  );
};

export default GenreHeader;
