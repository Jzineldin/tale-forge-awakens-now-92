
import React from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './home/HeroSection';
import AboutSection from './home/AboutSection';
import SafetyInfo from './home/SafetyInfo';
import Footer from './home/Footer';

const HomePage: React.FC = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Hero Section - Now includes main CTA */}
      <HeroSection />

      {/* Consolidated Features Section - Replaces How It Works and Coming Soon */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
              Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience interactive storytelling like never before
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white font-serif">Choose Your Path</h3>
              <p className="text-gray-300">Every choice you make shapes your unique story adventure</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-white font-serif">AI-Generated Content</h3>
              <p className="text-gray-300">Stories, images, and audio created just for you</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-white font-serif">Mobile Friendly</h3>
              <p className="text-gray-300">Enjoy your adventures anywhere, anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Educational Info */}
      <SafetyInfo />

      {/* About */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
