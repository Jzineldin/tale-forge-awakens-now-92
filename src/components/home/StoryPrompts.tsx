
import React from 'react';
import { Button } from '@/components/ui/button';
import { storyModes } from '@/data/storyModes';
import { getPromptsForStoryMode } from '@/data/storyPrompts';
import { Lightbulb, Sparkles, Star } from 'lucide-react';

interface StoryPromptsProps {
  storyMode: string;
  onPromptSelect: (prompt: string) => void;
  isLoading: boolean;
}

const StoryPrompts: React.FC<StoryPromptsProps> = ({ storyMode, onPromptSelect, isLoading }) => {
  const prompts = getPromptsForStoryMode(storyMode);

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Lightbulb className="h-8 w-8 text-amber-500" />
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 font-serif">
              Story Starters
            </h3>
            <Sparkles className="h-8 w-8 text-emerald-500" />
          </div>
          
          <p className="text-lg text-slate-600">
            Get inspired with these creative prompts
          </p>
        </div>

        {/* Prompts Grid - Professional styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prompts.slice(0, 4).map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="group h-auto p-4 text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
              onClick={() => onPromptSelect(prompt)}
              disabled={isLoading}
            >
              <div className="w-full flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-base leading-relaxed group-hover:text-slate-900 transition-colors break-words">
                    {prompt}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StoryPrompts;
