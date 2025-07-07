
import React from 'react';

const ForgeStepsSection: React.FC = () => {
  const steps = [
    {
      icon: '/images/icon-world.png',
      title: 'Create Your World',
      description: 'Describe your world, and our AI will help you fill in the details, from bustling cities to enchanted forests.'
    },
    {
      icon: '/images/icon-hero.png',
      title: 'Bring Your Hero to Life',
      description: 'Develop your character with unique traits, skills, and a rich backstory. The AI will remember who you are.'
    },
    {
      icon: '/images/icon-adventure.png',
      title: 'Embark on Your Adventure',
      description: 'Play through your story, making choices that matter. Our AI Dungeon Master will guide you through a dynamic and unpredictable narrative.'
    }
  ];

  return (
    <section className="py-8 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Semi-transparent backdrop for better readability */}
        <div className="backdrop-blur-sm bg-black/30 rounded-2xl p-6 md:p-8 border border-white/20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-serif magical-text">
              Forge Your Legend in Three Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-3 md:space-y-4">
                <div className="flex justify-center mb-3 md:mb-4">
                  <img
                    src={step.icon}
                    alt={step.title}
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
  );
};

export default ForgeStepsSection;
