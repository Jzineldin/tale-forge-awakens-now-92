
import React from 'react';
import HomePage from '@/components/HomePage';

const Index = () => {
  console.log('Index component: Rendering landing page only');

  return (
    <div className="relative h-screen w-full bg-transparent">
      <HomePage />
    </div>
  );
};

export default Index;
