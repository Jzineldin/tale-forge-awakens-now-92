
import React from 'react';

interface StoryDisplayLayoutProps {
  children: React.ReactNode;
}

const StoryDisplayLayout: React.FC<StoryDisplayLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-slate-900"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://cdn.midjourney.com/11bac597-89f4-4f16-99f0-4b114af4473f/0_2.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        {children}
      </div>
    </div>
  );
};

export default StoryDisplayLayout;
