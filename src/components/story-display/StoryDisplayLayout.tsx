
import React from 'react';

interface StoryDisplayLayoutProps {
  children: React.ReactNode;
}

const StoryDisplayLayout: React.FC<StoryDisplayLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(15, 23, 42, 0.9) 100%)
        `,
        backgroundSize: '800px 800px, 600px 600px, 100% 100%',
        backgroundPosition: '0 0, 100% 0%, 50% 50%'
      }}
    >
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        {children}
      </div>
    </div>
  );
};

export default StoryDisplayLayout;
