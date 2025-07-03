
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { HeroSection } from './home/HeroSection';
import SimpleStoryInput from './home/SimpleStoryInput';
import StoryPrompts from './home/StoryPrompts';
import AboutSection from './home/AboutSection';
import HowItWorks from './home/HowItWorks';
import GenreShowcase from './home/GenreShowcase';
import ComingSoon from './home/ComingSoon';
import Footer from './home/Footer';

const HomePage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [storyMode, setStoryMode] = useState('Epic Fantasy');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a story prompt");
      return;
    }
    
    if (!storyMode) {
      toast.error("Please select a story mode");
      return;
    }
    
    console.log('HomePage: Starting story creation with:', { 
      prompt: prompt.trim(), 
      storyMode 
    });
    
    // Navigate to the story creation page with prompt and mode as URL params
    const params = new URLSearchParams({
      prompt: prompt.trim(),
      mode: storyMode
    });
    
    const targetUrl = `/create-story?${params.toString()}`;
    console.log('HomePage: Navigating to:', targetUrl);
    
    navigate(targetUrl);
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

      {/* How It Works */}
      <HowItWorks />

      {/* Genre Selection - Reduced top padding */}
      <section className="py-8 px-4">
        <GenreShowcase
          selectedMode={storyMode}
          onSelectMode={setStoryMode}
          disabled={false}
        />
      </section>

      {/* Story Creation - Reduced spacing */}
      <section className="py-6 px-4" id="create-story">
        <div className="max-w-4xl mx-auto space-y-8">
          <SimpleStoryInput
            prompt={prompt}
            onPromptChange={setPrompt}
            onStart={handleStart}
            isLoading={false}
            storyMode={storyMode}
          />
          
          <StoryPrompts
            storyMode={storyMode}
            onPromptSelect={handlePromptSelect}
            isLoading={false}
          />
        </div>
      </section>

      {/* Coming Soon - Reduced top padding */}
      <section className="py-8">
        <ComingSoon />
      </section>

      {/* About */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
