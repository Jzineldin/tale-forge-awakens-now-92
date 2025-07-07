import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface StoryCompletionHeaderProps {
  segmentCount: number;
  totalWords: number;
  imageCount: number;
}

const StoryCompletionHeader: React.FC<StoryCompletionHeaderProps> = ({
  segmentCount,
  totalWords,
  imageCount
}) => {
  return (
    <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-amber-200 flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-amber-400" />
          🎉 Story Complete!
        </CardTitle>
        <p className="text-amber-300 text-lg mt-2">
          Your adventure concluded with <strong>{segmentCount} chapters</strong>, 
          <strong> {totalWords} words</strong>, and <strong>{imageCount} images</strong>
        </p>
      </CardHeader>
    </Card>
  );
};

export default StoryCompletionHeader;