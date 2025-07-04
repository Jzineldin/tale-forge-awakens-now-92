
import React from 'react';
import CinematicHero from './CinematicHero';
import Footer from './Footer';
import { Zap, Image, Headphones, Users, Shield, Sparkles } from 'lucide-react';

const CinematicLanding: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Hero Section with Video Background */}
      <CinematicHero />

      {/* Features Section - "Beyond Imagination" */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif magical-text">
              Beyond Imagination
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience storytelling like never before with cutting-edge AI technology that adapts to your creativity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-amber-400/30 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif">Dynamic Narratives</h3>
              <p className="text-gray-300 font-sans leading-relaxed">
                Every choice creates a unique path through limitless story possibilities
              </p>
            </div>
            
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-blue-400/30 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif">Visual Storytelling</h3>
              <p className="text-gray-300 font-sans leading-relaxed">
                Watch your stories come alive with AI-generated imagery that matches your narrative
              </p>
            </div>
            
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-emerald-400/30 transition-all duration-300">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Headphones className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif">Immersive Audio</h3>
              <p className="text-gray-300 font-sans leading-relaxed">
                Listen as professional AI voices bring characters and narration to life
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-serif magical-text">
              Crafted with Care
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif">Safe & Secure</h3>
              <p className="text-gray-300 font-sans leading-relaxed">
                Built with privacy and safety in mind, ensuring appropriate content for all users
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif">Community Driven</h3>
              <p className="text-gray-300 font-sans leading-relaxed">
                Join a growing community of storytellers and learners exploring new narratives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <Sparkles className="w-16 h-16 mx-auto text-amber-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">
              Your Story Awaits
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Step into a world where every tale is unique, every choice matters, and every adventure is yours to create.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CinematicLanding;
