
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Home } from 'lucide-react';
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
        <Card className="w-full max-w-2xl bg-slate-900/95 border-amber-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-amber-300 text-2xl flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 animate-pulse" />
              Creating Your Story...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
            <p className="text-slate-300">Generating your adventure...</p>
            <p className="text-slate-400 text-sm">API Calls: {apiCallsCount}</p>
            <Button onClick={onExit} variant="outline" className="mt-4">
              <Home className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </CardContent>
        </Card>
      </div>
    </StoryDisplayLayout>
  );
};

export default StoryLoadingState;
