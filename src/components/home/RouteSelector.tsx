
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const RouteSelector: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredSide, setHoveredSide] = useState<'adventure' | 'education' | null>(null);

  const handleAdventureClick = () => {
    navigate('/adventure');
  };

  const handleEducationClick = () => {
    // For now, just show an alert - we'll implement the educational flow later
    alert('Educational section coming soon! This will lead to the educational onboarding flow.');
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Adventure Section - Left Side */}
      <div 
        className={`flex-1 relative transition-all duration-500 cursor-pointer ${
          hoveredSide === 'adventure' ? 'flex-[1.1]' : hoveredSide === 'education' ? 'flex-[0.9]' : 'flex-1'
        }`}
        onMouseEnter={() => setHoveredSide('adventure')}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={handleAdventureClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800">
          {/* Overlay for hover effect */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            hoveredSide === 'adventure' ? 'bg-black/10' : 'bg-black/20'
          }`} />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8">
            <div className="mb-8">
              <Sparkles className="h-16 w-16 text-amber-400 mx-auto mb-4" />
              <h1 className="tale-forge-title text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-amber-400 mb-4">
                Tale Forge
              </h1>
              <h2 className="text-2xl md:text-3xl font-serif text-white/90 mb-6">
                Interactive Adventures
              </h2>
              <p className="text-lg text-white/80 max-w-md mx-auto mb-8">
                Create magical stories where every choice shapes your destiny. Adventure awaits!
              </p>
            </div>
            
            <Button
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Your Adventure
            </Button>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-1 bg-gradient-to-b from-amber-400/50 via-amber-400 to-amber-400/50" />

      {/* Educational Section - Right Side */}
      <div 
        className={`flex-1 relative transition-all duration-500 cursor-pointer ${
          hoveredSide === 'education' ? 'flex-[1.1]' : hoveredSide === 'adventure' ? 'flex-[0.9]' : 'flex-1'
        }`}
        onMouseEnter={() => setHoveredSide('education')}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={handleEducationClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-emerald-900 to-green-800">
          {/* Overlay for hover effect */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            hoveredSide === 'education' ? 'bg-black/10' : 'bg-black/20'
          }`} />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8">
            <div className="mb-8">
              <GraduationCap className="h-16 w-16 text-amber-400 mx-auto mb-4" />
              <h1 className="tale-forge-title text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-amber-400 mb-4">
                Tale Forge
              </h1>
              <h2 className="text-2xl md:text-3xl font-serif text-white/90 mb-6">
                Learning Journeys
              </h2>
              <p className="text-lg text-white/80 max-w-md mx-auto mb-8">
                Transform learning into engaging adventures. Explore subjects through interactive storytelling.
              </p>
            </div>
            
            <Button
              className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
