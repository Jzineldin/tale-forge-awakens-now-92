
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleStoryInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onStart: () => void;
  isLoading: boolean;
  storyMode: string;
}

const SimpleStoryInput: React.FC<SimpleStoryInputProps> = ({
  prompt,
  onPromptChange,
  onStart,
  isLoading,
  storyMode
}) => {
  const handleStart = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a story prompt");
      return;
    }
    onStart();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg p-8 space-y-6">

        <div className="relative">
          <Textarea
            placeholder="A brave knight discovers a hidden dragon's lair, or a student finds a mysterious book in the library..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="min-h-[120px] text-lg p-4 bg-white border-slate-300 text-slate-800 placeholder:text-slate-500 placeholder:text-base focus:border-amber-400 focus:ring-amber-400/20 resize-none rounded-lg"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleStart}
          disabled={isLoading || !prompt.trim()}
          className="w-full py-4 text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating your story...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              Start Creating
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SimpleStoryInput;
