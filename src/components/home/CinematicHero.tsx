
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
      {/* Full-screen Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.8) contrast(1.1) saturate(1.2)' }}
      >
        <source src="https://cdn.midjourney.com/video/0dc9b96f-b761-47b5-b668-73d433c809e9/3.mp4" type="video/mp4" />
      </video>

      {/* Lighter Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20"></div>

      {/* Main Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        {/* Tale Forge Title */}
        <div className="text-center mb-16">
          <h1 className="tale-forge-title text-6xl md:text-8xl lg:text-9xl font-bold font-serif text-white mb-8 leading-tight">
            Tale Forge
          </h1>
          
          {/* Simple Tagline */}
          <p className="text-2xl md:text-4xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
            Where imagination meets
            <span className="font-cursive text-amber-300 mx-2" style={{fontStyle: 'italic'}}>
              infinite possibilities
            </span>
          </p>
        </div>

        {/* Simple CTA */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            onClick={handleCreateAdventure}
            className="group px-8 py-4 text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            Create Your Adventure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
