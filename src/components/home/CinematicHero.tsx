
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeaderVisibility } from '@/context/HeaderVisibilityContext';

const CinematicHero: React.FC = () => {
  const navigate = useNavigate();
  const { showHeader } = useHeaderVisibility();

  const handleCreateAdventure = () => {
    showHeader();
    navigate('/adventure');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-screen Image Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://cdn.midjourney.com/9ec967b3-6669-45ea-927f-1b3492a72cf3/0_0.png")',
          filter: 'brightness(0.7) contrast(1.1) saturate(1.2)'
        }}
      />

      {/* Strengthened Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70"></div>

      {/* Main Content Overlay with Glassmorphism */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        {/* Glassmorphism Container */}
        <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl max-w-5xl mx-auto">
          {/* Tale Forge Title */}
          <div className="text-center mb-16">
            <h1 className="tale-forge-title text-6xl md:text-8xl lg:text-9xl font-bold font-serif text-white mb-8 leading-tight">
              Tale Forge
            </h1>
            
            {/* Simple Tagline */}
            <p className="text-2xl md:text-4xl text-white max-w-4xl mx-auto leading-relaxed mb-8 text-shadow-strong">
              Where imagination meets
              <span className="font-cursive text-amber-300 mx-2" style={{fontStyle: 'italic'}}>
                infinite possibilities
              </span>
            </p>
          </div>

          {/* Simple CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={handleCreateAdventure}
              className="group px-8 py-4 text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Create Your Adventure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
