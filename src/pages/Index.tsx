
import React from 'react';
import CinematicLanding from '@/components/home/CinematicLanding';
import ForgeStepsSection from '@/components/home/ForgeStepsSection';

const Index = () => {
  console.log('Index component: Rendering cinematic landing page');

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      {/* Single continuous background with all content overlaid */}
      <div className="relative min-h-screen w-full">
        <CinematicLanding />
        
        {/* Overlay the Forge Steps Section on the same background - no gap */}
        <div className="relative z-20 -mt-32 md:-mt-16">
          <ForgeStepsSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
