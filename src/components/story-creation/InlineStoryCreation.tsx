
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { CostConfirmationDialog } from '@/components/CostConfirmationDialog';
import StoryDisplayLayout from '@/components/story-display/StoryDisplayLayout';
import CompleteStoryViewer from './CompleteStoryViewer';
import StoryErrorState from './StoryErrorState';
import StoryLoadingState from './StoryLoadingState';
import StoryImageSection from './StoryImageSection';
import StoryTextSection from './StoryTextSection';
import StoryChoicesSection from './StoryChoicesSection';
import StoryEndSection from './StoryEndSection';
import VoiceGenerationSection from './VoiceGenerationSection';
import StoryImageSettings from './StoryImageSettings';
import { useProgressiveStoryGeneration } from '@/hooks/story-creation/useProgressiveStoryGeneration';

interface InlineStoryCreationProps {
  onExit: () => void;
}

const InlineStoryCreation: React.FC<InlineStoryCreationProps> = ({ onExit }) => {
  const navigate = useNavigate();
  const {
    currentSegment,
    isImageGenerating,
    generateSegment,
    isGenerating,
    error
  } = useProgressiveStoryGeneration();

  // For now, we'll use simple state management instead of the complex inline generation hook
  const [storyHistory, setStoryHistory] = React.useState<any[]>([]);
  const [showCostDialog, setShowCostDialog] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<string>('');
  const [skipImage, setSkipImage] = React.useState(false);
  const [apiCallsCount, setApiCallsCount] = React.useState(0);
  const [selectedVoice, setSelectedVoice] = React.useState('alloy');
  const [fullStoryAudioUrl, setFullStoryAudioUrl] = React.useState<string>('');
  const [showImageSettings, setShowImageSettings] = React.useState(false);

  // Mock generate audio mutation for now
  const generateAudioMutation = {
    isPending: false,
    mutate: () => {}
  };

  const handleStoryFinish = () => {
    if (currentSegment) {
      console.log('🎯 Story completed, redirecting to story view:', currentSegment.story_id);
      navigate(`/story/${currentSegment.story_id}`, { replace: true });
    }
  };

  const showConfirmation = (action: string, choice?: string) => {
    setPendingAction(action);
    setShowCostDialog(true);
  };

  const confirmGeneration = async () => {
    setShowCostDialog(false);
    setApiCallsCount(prev => prev + 1);
    
    if (pendingAction === 'choice') {
      // Handle choice selection - for now just log
      console.log('Choice selected, would generate next segment');
    } else if (pendingAction === 'audio') {
      // Handle audio generation - for now just log
      console.log('Audio generation requested');
    }
  };

  const resetStory = () => {
    // Reset story state
    console.log('Resetting story');
  };

  // Get URL parameters for initial story generation
  const urlParams = new URLSearchParams(window.location.search);
  const prompt = urlParams.get('prompt') || '';
  const mode = urlParams.get('mode') || 'fantasy';

  // Initial story generation on mount
  React.useEffect(() => {
    if (!currentSegment && prompt) {
      console.log('🚀 Starting initial story generation with prompt:', prompt);
      generateSegment({
        prompt,
        storyMode: mode,
        skipImage: skipImage,
        skipAudio: true
      }).catch(console.error);
    }
  }, [prompt, mode, skipImage, currentSegment, generateSegment]);

  // Show error state
  if (error && !isGenerating) {
    return (
      <StoryErrorState
        error={error}
        onRetry={resetStory}
        onExit={onExit}
      />
    );
  }

  // Show loading state only during initial generation without any content
  if (isGenerating && !currentSegment) {
    return (
      <StoryLoadingState
        apiCallsCount={apiCallsCount}
        onExit={onExit}
      />
    );
  }

  // Show complete story viewer when story is finished and has audio
  if (currentSegment?.is_end && fullStoryAudioUrl) {
    return (
      <StoryDisplayLayout>
        <CompleteStoryViewer
          storyHistory={storyHistory}
          fullStoryAudioUrl={fullStoryAudioUrl}
          onExit={onExit}
        />
      </StoryDisplayLayout>
    );
  }

  // Show image settings before story starts
  if (showImageSettings && !currentSegment) {
    return (
      <StoryDisplayLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-2xl space-y-6">
            <StoryImageSettings
              skipImage={skipImage}
              onSkipImageChange={setSkipImage}
            />
            <div className="text-center">
              <p className="text-gray-300 text-lg mb-4">Your story is ready to begin!</p>
              <p className="text-gray-400 text-sm">Story generation will start automatically...</p>
            </div>
          </div>
        </div>
      </StoryDisplayLayout>
    );
  }

  // Show story display with progressive loading
  if (currentSegment) {
    return (
      <StoryDisplayLayout>
        <Card className="w-full max-w-4xl mx-auto bg-slate-900/95 border-amber-500/30 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-white text-2xl font-serif flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-400" />
              {currentSegment.is_end ? "Story Complete!" : "Your Story Continues"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Progressive Image Section - shows immediately with loading states */}
            <StoryImageSection
              imageUrl={currentSegment.image_url}
              imageGenerationStatus={currentSegment.image_generation_status}
            />

            {/* Story Text - available immediately */}
            <StoryTextSection text={currentSegment.segment_text} />

            {/* Choices - available immediately for user interaction */}
            {!currentSegment.is_end && currentSegment.choices && (
              <StoryChoicesSection
                choices={currentSegment.choices}
                isGenerating={false} // Don't disable choices during image generation
                onChoiceSelect={(choice) => showConfirmation('choice', choice)}
              />
            )}

            <StoryEndSection
              isEnd={currentSegment.is_end || false}
              isGenerating={isGenerating}
              onFinishStory={handleStoryFinish}
              onExit={onExit}
            />

            {currentSegment.is_end && !fullStoryAudioUrl && (
              <VoiceGenerationSection
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                onGenerateAudio={() => showConfirmation('audio')}
                isGenerating={generateAudioMutation.isPending}
              />
            )}

            {/* Show subtle indicator when image is generating in background */}
            {isImageGenerating && (
              <div className="text-center text-amber-300/70 text-sm">
                ✨ Enhancing your story with a custom image...
              </div>
            )}
          </CardContent>
        </Card>

        <CostConfirmationDialog
          open={showCostDialog}
          onOpenChange={setShowCostDialog}
          onConfirm={confirmGeneration}
          pendingAction={pendingAction}
          skipImage={skipImage}
          skipAudio={true}
          onSkipImageChange={setSkipImage}
          onSkipAudioChange={() => {}}
          apiUsageCount={apiCallsCount}
          showAudioOption={false}
        />
      </StoryDisplayLayout>
    );
  }

  return null;
};

export default InlineStoryCreation;
