
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stars, Feather, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthPrompt from './AuthPrompt';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateStory = () => {
    navigate('/create/genre');
  };

  return (
    <div className="relative min-h-[90vh] hero-section">
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section - Restructured layout */}
        <div className="text-center mb-8 space-y-12 min-h-[85vh] flex flex-col justify-center">
          {/* Magical header with floating elements */}
          <div className="relative">
            {/* Floating magical elements */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <Stars className="h-16 w-16 text-amber-300/80 animate-pulse drop-shadow-lg" />
            </div>
            <div className="absolute -top-8 left-1/4 transform -translate-x-1/2">
              <Sparkles className="h-12 w-12 text-blue-300/70 animate-pulse delay-500 drop-shadow-lg" />
            </div>
            <div className="absolute -top-10 right-1/4 transform translate-x-1/2">
              <BookOpen className="h-14 w-14 text-purple-300/60 animate-pulse delay-1000 drop-shadow-lg" />
            </div>
            
            {/* Tale Forge title */}
            <h1 className="tale-forge-title text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-serif text-white mb-8 leading-tight relative">
              Tale Forge
              {/* Single subtle glow effect */}
              <div className="tale-forge-glow absolute inset-0 tale-forge-title -z-10">
                Tale Forge
              </div>
            </h1>
            
            <div className="absolute -bottom-6 right-1/2 transform translate-x-1/2">
              <Feather className="h-12 w-12 text-amber-200/80 animate-bounce drop-shadow-lg" />
            </div>
          </div>

          {/* Improved subtitle messaging */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-2xl md:text-3xl lg:text-4xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                Turn any idea into an{' '}
                <span className="font-cursive font-bold text-amber-300 whitespace-nowrap" style={{fontStyle: 'italic'}}>
                  interactive story
                </span>
              </p>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-sans">
                Write a simple prompt and watch it become a branching adventure where 
                <strong className="text-amber-200"> every choice matters</strong>
              </p>
            </div>
            
            {/* Main CTA - Single focused button */}
            <div className="space-y-4">
              <Button
                onClick={handleCreateStory}
                className="cta-btn px-12 py-4 text-xl text-white font-semibold rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 transition-all duration-200"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Story Now
              </Button>
              <p className="text-sm text-gray-400 font-sans">
                ✨ No account required to start • Safe for all ages • 100% interactive
              </p>
            </div>
          </div>
          
          {/* Auth/Waitlist cards */}
          <div className="w-full max-w-6xl mx-auto">
            <AuthPrompt />
          </div>
          
          {/* Enhanced quote */}
          <div className="w-full flex justify-center mt-16">
            <div className="quote-box max-w-4xl mx-auto">
              <div className="quote-content bg-black/30 backdrop-blur-sm rounded-xl border border-amber-200/30 p-8">
                <p className="quote-text text-amber-100/95 font-cursive text-xl md:text-2xl lg:text-3xl leading-relaxed text-center">
                  "Every great story begins with a single sentence. 
                  What will yours become?"
                </p>
                <div className="quote-attribution text-amber-200/80 text-center mt-6 text-lg">
                  — Start your adventure today
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative three-dot row */}
          <div className="flex justify-center space-x-12 mt-12">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-2 h-2 bg-gradient-to-r from-amber-300/70 to-yellow-300/70 rounded-full animate-pulse drop-shadow-lg" />
              <div className="w-1 h-1 bg-amber-300/50 rounded-full animate-pulse delay-100" />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-300/60 to-orange-300/60 rounded-full animate-pulse delay-200 drop-shadow-lg" />
              <div className="w-1.5 h-1.5 bg-amber-300/40 rounded-full animate-pulse delay-300" />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-amber-300/65 to-yellow-300/65 rounded-full animate-pulse delay-400 drop-shadow-lg" />
              <div className="w-1 h-1 bg-amber-300/45 rounded-full animate-pulse delay-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
