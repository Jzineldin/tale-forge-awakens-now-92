
import React from 'react';
import SplitScreenOverlay from '@/components/home/SplitScreenOverlay';

const Index = () => {
  console.log('Index component: Rendering split-screen overlay');

  return (
    <div className="relative h-screen w-full bg-transparent">
      <SplitScreenOverlay 
        creativeStudioImage="/images/Flux_Dev_Lonely_astronaut_sitting_on_a_pile_of_books_in_space__0.jpg"
        learningLabImage="/images/Leonardo_Phoenix_10_A_cozy_wooden_library_at_night_with_floati_0.jpg"
      />
    </div>
  );
};

export default Index;
