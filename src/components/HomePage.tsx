
import React from 'react';
import { useAuth } from '@/context/AuthProvider';
import { HeroSection } from './home/HeroSection';
import ValuePropositionSection from './home/ValuePropositionSection';
import ExampleStoriesSection from './home/ExampleStoriesSection';
import WhyTaleForgeWorksSection from './home/WhyTaleForgeWorksSection';
import FAQSection from './home/FAQSection';
import Footer from './home/Footer';

const HomePage: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  const storySteps = [
    {
      icon: '/images/icon-world.png',
      title: 'Describe Your Vision',
      description: 'Start with any idea: "A detective finds a mysterious letter" or "Kids discover a magic portal." Just a sentence or two is all you need.'
    },
    {
      icon: '/images/icon-hero.png',
      title: 'Watch It Come Alive',
      description: 'Our AI creates rich scenes with custom images and voice narration, building characters and settings that feel real and engaging.'
    },
    {
      icon: '/images/icon-adventure.png',
      title: 'Shape Your Story',
      description: 'Make choices that matter. Will the detective investigate alone or call for backup? Every decision creates a unique path through your adventure.'
    }
  ];

  return (
    <div className="min-h-screen w-full relative">
      {/* Hero Section - Single focused CTA with waitlist */}
      <HeroSection />

      {/* Value Proposition - Transform Any Idea */}
      <ValuePropositionSection />

      {/* Enhanced How Your Story Unfolds Section */}
      <section className="py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-sm bg-black/30 rounded-2xl p-6 md:p-8 border border-white/20">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-serif magical-text">
                How Your Story Unfolds
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-sans">
                Three simple steps from your idea to an immersive interactive experience
              </p>
            </div>

            <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {storySteps.map((step, index) => (
                <div key={index} className="feature-column text-center space-y-3 md:space-y-4">
                  <div className="flex justify-center mb-3 md:mb-4">
                    <img
                      src={step.icon}
                      alt={`${step.title} Icon`}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white font-serif">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 font-sans leading-relaxed px-2">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <ExampleStoriesSection />

      {/* Why Tale Forge Works - Replaces "Our Quest" */}
      <WhyTaleForgeWorksSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
