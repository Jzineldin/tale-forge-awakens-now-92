
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SegmentContentProps {
    segmentText: string;
    triggeringChoiceText?: string;
    isEnd: boolean;
    index: number;
    canContinue: boolean;
    segmentId: string;
    onGoBack: (segmentId: string) => void;
    isGoBackPending: boolean;
}

const SegmentContent: React.FC<SegmentContentProps> = ({
    segmentText,
    triggeringChoiceText,
    isEnd,
    index,
    canContinue,
    segmentId,
    onGoBack,
    isGoBackPending
}) => {
    return (
        <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-amber-300">Chapter {index + 1}</h3>
                {canContinue && index > 0 && (
                    <Button
                        onClick={() => onGoBack(segmentId)}
                        disabled={isGoBackPending}
                        variant="outline"
                        size="sm"
                        className="border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {isGoBackPending ? 'Going back...' : 'Go back to here'}
                    </Button>
                )}
            </div>
            
            {triggeringChoiceText && (
                <div className="p-3 bg-slate-800/60 border border-amber-500/20 rounded-lg">
                    <p className="text-amber-200 text-sm font-medium">You chose:</p>
                    <p className="text-gray-100 italic">"{triggeringChoiceText}"</p>
                </div>
            )}
            
            <div className="prose prose-invert max-w-none">
                <div className="text-gray-100 text-base leading-relaxed whitespace-pre-wrap font-serif bg-slate-800/40 p-4 rounded-lg border border-slate-700/50">
                    {segmentText}
                </div>
            </div>
            
            {isEnd && (
                <div className="text-center py-4">
                    <div className="text-amber-300 text-xl font-bold">🎉 The End 🎉</div>
                    <p className="text-gray-300 mt-2">Your story has reached its conclusion!</p>
                </div>
            )}
        </div>
    );
};

export default SegmentContent;
