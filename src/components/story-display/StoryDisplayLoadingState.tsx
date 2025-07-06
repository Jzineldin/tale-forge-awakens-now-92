
import React from 'react';
import StoryHeader from './StoryHeader';

interface StoryDisplayLoadingStateProps {
  apiUsageCount: number;
  skipImage: boolean;
  onExit: () => void;
}

const StoryDisplayLoadingState: React.FC<StoryDisplayLoadingStateProps> = ({
  apiUsageCount,
  skipImage,
  onExit
}) => {
  return (
    <div 
      className="min-h-screen bg-slate-700"
      style={{
        backgroundImage: `linear-gradient(rgba(71, 85, 105, 0.85), rgba(51, 65, 85, 0.85)), url('/images/Flux_Dev_Lonely_astronaut_sitting_on_a_pile_of_books_in_space__0.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <StoryHeader 
          onExit={onExit}
          onSave={() => {}}
          apiUsageCount={apiUsageCount}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-white max-w-md bg-slate-800/90 p-8 rounded-xl border border-amber-500/30 backdrop-blur-sm shadow-2xl">
            <div className="flex justify-center mb-6 space-x-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-400 border-t-4 border-amber-400/30"></div>
            </div>
            <h2 className="text-3xl font-serif mb-4 text-amber-300">Crafting Your Story...</h2>
            <div className="space-y-4 text-slate-100">
              <div className="flex items-center justify-center gap-3 bg-slate-700/60 p-3 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Generating story text...</span>
              </div>
              {!skipImage && (
                <div className="flex items-center justify-center gap-3 bg-slate-700/60 p-3 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Creating visual scene...</span>
                </div>
              )}
            </div>
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-200 font-medium">
                This usually takes 30-60 seconds. Please wait...
              </p>
              <p className="text-xs text-slate-300 mt-2">
                API Calls: {apiUsageCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDisplayLoadingState;
