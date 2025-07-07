
import React from 'react';
import CinematicLanding from '@/components/home/CinematicLanding';
import ForgeStepsSection from '@/components/home/ForgeStepsSection';

const Index = () => {
  console.log('Index component: Rendering cinematic landing page');

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      <CinematicLanding />
      
      {/* Add the Forge Steps Section below the main hero */}
      <ForgeStepsSection />
    </div>
  );
};

export default Index;
