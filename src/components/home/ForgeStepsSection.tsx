
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
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif magical-text">
            Forge Your Legend in Three Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <img
                  src={step.icon}
                  alt={step.title}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">
                {step.title}
              </h3>
              <p className="text-gray-300 font-sans leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForgeStepsSection;
