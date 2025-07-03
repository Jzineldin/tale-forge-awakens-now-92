
import React from 'react';
import RouteSelector from '@/components/home/RouteSelector';

const Index = () => {
  console.log('Index component: Rendering route selector overlay');

  return (
    <div className="relative h-screen w-full bg-transparent">
      <RouteSelector />
    </div>
  );
};

export default Index;
