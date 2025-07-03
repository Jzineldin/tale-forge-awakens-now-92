
import React from 'react';
import { Stars, Feather, BookOpen, Sparkles } from 'lucide-react';
import AuthPrompt from './AuthPrompt';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section - Restructured layout */}
        <div className="text-center mb-8 space-y-8 min-h-[75vh] flex flex-col justify-center">
          {/* Magical header with floating elements */}
          <div className="relative">
            {/* Floating magical elements */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <Stars className="h-16 w-16 text-amber-400/70 animate-pulse drop-shadow-lg" />
            </div>
            <div className="absolute -top-8 left-1/4 transform -translate-x-1/2">
              <Sparkles className="h-12 w-12 text-emerald-400/60 animate-pulse delay-500 drop-shadow-lg" />
            </div>
            <div className="absolute -top-10 right-1/4 transform translate-x-1/2">
              <BookOpen className="h-14 w-14 text-orange-400/50 animate-pulse delay-1000 drop-shadow-lg" />
            </div>
            
            {/* Tale Forge title */}
            <h1 className="tale-forge-title text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-serif text-slate-800 mb-6 leading-tight relative">
              Tale Forge
              {/* Single subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent opacity-30 -z-10">
                Tale Forge
              </div>
            </h1>
            
            <div className="absolute -bottom-6 right-1/2 transform translate-x-1/2">
              <Feather className="h-12 w-12 text-amber-500/70 animate-bounce drop-shadow-lg" />
            </div>
          </div>

          {/* Subtitle - Professional and clear */}
          <div className="space-y-6">
            <p className="text-2xl md:text-3xl lg:text-4xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
              Interactive storytelling for{' '}
              <span className="font-cursive font-bold text-amber-600 whitespace-nowrap" style={{fontStyle: 'italic'}}>
                educators & creators
              </span>
            </p>
            
            {/* Primary CTA - Professional and clear */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#create-story" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-8 py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Create Your First Story
              </a>
              <a href="#how-it-works" className="px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-all duration-200">
                Learn How It Works
              </a>
            </div>
          </div>
          
          {/* Auth/Waitlist cards - now focused on waitlist */}
          <div className="w-full max-w-6xl mx-auto">
            <AuthPrompt />
          </div>
          
          {/* Quote card - professional styling */}
          <div className="w-full flex justify-center mt-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 p-8 shadow-lg">
                <p className="text-slate-700 font-cursive text-xl md:text-2xl lg:text-3xl leading-relaxed text-center">
                  "Empowering educators and inspiring creators with AI-powered storytelling that brings imagination to life"
                </p>
                <div className="text-slate-500 text-center mt-6 text-lg">
                  — Designed for learning and creativity
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
