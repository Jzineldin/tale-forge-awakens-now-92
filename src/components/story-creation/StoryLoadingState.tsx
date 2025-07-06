
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, Wand2, BookOpen } from 'lucide-react';
import StoryDisplayLayout from '@/components/story-display/StoryDisplayLayout';

interface StoryLoadingStateProps {
  apiCallsCount: number;
  onExit: () => void;
}

const StoryLoadingState: React.FC<StoryLoadingStateProps> = ({
  apiCallsCount,
  onExit
}) => {
  return (
    <StoryDisplayLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl bg-slate-800/95 border-amber-500/40 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-amber-300 text-3xl flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 animate-pulse" />
              Creating Your Story...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Animated icons */}
            <div className="flex justify-center mb-6 space-x-6">
              <Sparkles className="h-10 w-10 text-amber-400 animate-pulse" />
              <Wand2 className="h-10 w-10 text-purple-400 animate-bounce" />
              <BookOpen className="h-10 w-10 text-blue-400 animate-pulse" />
            </div>
            
            {/* Main spinner */}
            <div className="relative mx-auto w-20 h-20">
              <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-amber-400 border-t-4 border-amber-400/30"></div>
              <div className="absolute inset-2 animate-spin-slow rounded-full border-2 border-purple-400/50"></div>
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-100 text-lg font-medium">Generating your adventure...</p>
              <div className="bg-slate-700/60 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-center gap-2 text-blue-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">✨ Initializing AI storyteller...</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-purple-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">📖 Crafting your unique narrative...</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">🎨 Preparing visual elements...</span>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
              <p className="text-amber-200 text-sm font-medium">API Calls: {apiCallsCount}</p>
            </div>
            
            <Button onClick={onExit} variant="outline" className="mt-6 border-slate-500 text-slate-200 hover:bg-slate-700">
              <Home className="mr-2 h-4 w-4" />
              Exit to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </StoryDisplayLayout>
  );
};

export default StoryLoadingState;
