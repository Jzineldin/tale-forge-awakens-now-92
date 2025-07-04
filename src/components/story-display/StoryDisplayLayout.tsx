
import React from 'react';

interface StoryDisplayLayoutProps {
  children: React.ReactNode;
}

const StoryDisplayLayout: React.FC<StoryDisplayLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800"
      style={{
        backgroundImage: `linear-gradient(rgba(252, 211, 77, 0.1), rgba(245, 158, 11, 0.05)), url('https://cdn.midjourney.com/11bac597-89f4-4f16-99f0-4b114af4473f/0_2.png')`,
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
