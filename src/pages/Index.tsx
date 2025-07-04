
import React from 'react';
import CinematicLanding from '@/components/home/CinematicLanding';

const Index = () => {
  console.log('Index component: Rendering cinematic landing page');

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      <CinematicLanding />
    </div>
  );
};

export default Index;
