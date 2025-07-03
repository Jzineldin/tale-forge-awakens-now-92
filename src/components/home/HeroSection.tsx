
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateStory = () => {
    navigate('/create/genre');
  };

  return (
    <div className="relative min-h-[90vh] hero-section">
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8 space-y-12 min-h-[85vh] flex flex-col justify-center">
          {/* Tale Forge title */}
          <div className="relative">
            <h1 className="tale-forge-title text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-serif text-white mb-8 leading-tight relative">
              Tale Forge
              <div className="tale-forge-glow absolute inset-0 tale-forge-title -z-10">
                Tale Forge
              </div>
            </h1>
          </div>

          {/* Tagline */}
          <div className="space-y-8">
            <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              What if your next adventure began with just{' '}
              <span className="font-cursive font-bold text-amber-300 whitespace-nowrap" style={{fontStyle: 'italic'}}>
                one sentence?
              </span>
            </p>
            
            {/* Single Primary CTA */}
            <div className="space-y-4">
              <Button
                onClick={handleCreateStory}
                className="cta-btn px-12 py-4 text-xl text-white font-semibold rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 transition-all duration-200"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Story Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
