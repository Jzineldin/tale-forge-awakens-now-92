
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VoiceSelector } from '@/components/VoiceSelector';
import { useGenerateFullStoryAudio } from '@/hooks/useGenerateFullStoryAudio';
import { Mic, Loader2 } from 'lucide-react';

interface GenerateVoiceButtonProps {
  storyId: string;
  storyTitle: string;
  onSuccess?: () => void;
}

const GenerateVoiceButton: React.FC<GenerateVoiceButtonProps> = ({ 
  storyId, 
  storyTitle, 
  onSuccess 
}) => {
  const [selectedVoice, setSelectedVoice] = useState('fable');
  const [isOpen, setIsOpen] = useState(false);
  const generateAudioMutation = useGenerateFullStoryAudio();

  const handleGenerateAudio = () => {
    generateAudioMutation.mutate(
      { storyId, voiceId: selectedVoice },
      {
        onSuccess: () => {
          setIsOpen(false);
          onSuccess?.();
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={generateAudioMutation.isPending}
        >
          {generateAudioMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Mic className="h-4 w-4 mr-2" />
          )}
          {generateAudioMutation.isPending ? 'Generating...' : 'Generate Voice'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-amber-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-300">Generate Voice Narration</DialogTitle>
          <DialogDescription className="text-gray-300">
            Select a voice for "{storyTitle.substring(0, 30)}..."
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <VoiceSelector
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
            disabled={generateAudioMutation.isPending}
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={generateAudioMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateAudio}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={generateAudioMutation.isPending}
            >
              {generateAudioMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Audio'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateVoiceButton;
