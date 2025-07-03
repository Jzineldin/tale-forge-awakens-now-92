
import React from 'react';
import { Sparkles, Wand2, BookOpen } from 'lucide-react';

interface StoryCreationLoadingStateProps {
  message: string;
  submessage?: string;
}

const StoryCreationLoadingState: React.FC<StoryCreationLoadingStateProps> = ({
  message,
  submessage
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center text-white max-w-md">
        {/* Animated icons */}
        <div className="flex justify-center mb-6 space-x-4">
          <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
          <Wand2 className="h-8 w-8 text-pink-400 animate-bounce" />
          <BookOpen className="h-8 w-8 text-blue-400 animate-pulse" />
        </div>
        
        {/* Spinning loader */}
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
        
        {/* Messages */}
        <h2 className="text-2xl font-serif mb-2">{message}</h2>
        {submessage && (
          <p className="text-purple-300 text-sm leading-relaxed">{submessage}</p>
        )}
        
        {/* Progress indicators */}
        <div className="mt-8 space-y-2">
          <div className="text-xs text-purple-400">
            ✨ Initializing AI storyteller...
          </div>
          <div className="text-xs text-purple-400">
            📖 Crafting your unique narrative...
          </div>
          <div className="text-xs text-purple-400">
            🎨 Preparing visual elements...
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCreationLoadingState;
