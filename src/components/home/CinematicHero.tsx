
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CinematicHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.4) contrast(1.1) saturate(1.2)' }}
      >
        <source src="https://cdn.midjourney.com/video/566c522d-e313-44be-a80b-06c61ca372ea/0.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="magical-particles"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        {/* Logo */}
        <div className="text-center mb-16">
          <h1 className="tale-forge-title text-6xl md:text-8xl lg:text-9xl font-bold font-serif text-white mb-8 leading-tight">
            Tale Forge
            <div className="tale-forge-glow absolute inset-0 tale-forge-title -z-10 blur-sm">
              Tale Forge
            </div>
          </h1>
          
          {/* Tagline */}
          <p className="text-2xl md:text-4xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-4">
            Where imagination meets
            <span className="font-cursive text-amber-300 mx-2" style={{fontStyle: 'italic'}}>
              infinite possibilities
            </span>
          </p>
          
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Craft immersive stories with AI-powered narrative generation
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Button
            onClick={() => navigate('/adventure')}
            className="group px-8 py-4 text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            Create Your Adventure
          </Button>
          
          <Button
            onClick={() => navigate('/learning')}
            variant="outline"
            className="px-8 py-4 text-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Explore Learning
          </Button>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-black/30 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Interactive Stories</h3>
            <p className="text-white/70 text-sm">Shape your narrative with every choice</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-black/30 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-white/70 text-sm">Advanced AI brings your ideas to life</p>
          </div>
          
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-black/30 transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Rich Media</h3>
            <p className="text-white/70 text-sm">Stories with images, audio, and more</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-white/60 to-transparent rounded-full mb-2"></div>
          <span className="text-xs font-medium">Scroll to explore</span>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
