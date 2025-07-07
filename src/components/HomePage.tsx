import React from 'react';
import { useAuth } from '@/context/AuthProvider';
import { HeroSection } from './home/HeroSection';
import Footer from './home/Footer';
import { Zap, Image, Headphones } from 'lucide-react';

const HomePage: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Hero Section - Single focused CTA with waitlist */}
      <HeroSection />

      {/* Features Section - "A Universe of Possibilities" */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif magical-text">
              A Universe of Possibilities
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">Interactive Storytelling</h3>
              <p className="text-gray-300 font-sans">Make choices that shape your narrative</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
                <Image className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">AI-Powered Imagery</h3>
              <p className="text-gray-300 font-sans">See your story come to life with generated art</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">Voice Narration</h3>
              <p className="text-gray-300 font-sans">Listen to your adventure unfold</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - "Our Quest" - Clean without dark overlay */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-serif magical-text">
            Our Quest
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed font-sans">
            We empower creativity and education through interactive storytelling, 
            making every choice an opportunity for discovery and growth.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
