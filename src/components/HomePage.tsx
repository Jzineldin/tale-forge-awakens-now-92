
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { HeroSection } from './home/HeroSection';
import SimpleStoryInput from './home/SimpleStoryInput';
import StoryPrompts from './home/StoryPrompts';
import AboutSection from './home/AboutSection';
import FeatureShowcase from './home/FeatureShowcase';
import Footer from './home/Footer';

const HomePage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a story prompt");
      return;
    }
    
    console.log('HomePage: Starting story creation with:', { 
      prompt: prompt.trim()
    });
    
    // Navigate to the new step-by-step story creation flow
    navigate('/create/genre');
  };

  const handlePromptSelect = (selectedPrompt: string) => {
    console.log('HomePage: Prompt selected:', selectedPrompt);
    setPrompt(selectedPrompt);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Hero Section - Now includes auth cards and quote */}
      <HeroSection />

      {/* Feature Showcase & How It Works */}
      <FeatureShowcase />

      {/* Story Creation - Simplified */}
      <section className="py-12 px-4" id="create-story">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">
              Start Your Story Adventure
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Begin with a simple idea and watch it transform into an interactive narrative
            </p>
          </div>
          
          <SimpleStoryInput
            prompt={prompt}
            onPromptChange={setPrompt}
            onStart={handleStart}
            isLoading={false}
            storyMode="Epic Fantasy"
          />
          
          <StoryPrompts
            storyMode="Epic Fantasy"
            onPromptSelect={handlePromptSelect}
            isLoading={false}
          />
        </div>
      </section>

      {/* About */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
