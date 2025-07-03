
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StoryTextSectionProps {
  text: string;
}

const StoryTextSection: React.FC<StoryTextSectionProps> = ({ text }) => {
  return (
    <div className="story-text-section w-full">
      <Card className="bg-slate-800/80 border-amber-500/20 shadow-inner">
        <CardContent className="p-8">
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-gray-100 text-lg leading-relaxed font-serif whitespace-pre-wrap"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {text}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryTextSection;
