
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
import { useInlineStoryGeneration } from '@/hooks/story-creation/useInlineStoryGeneration';

interface InlineStoryCreationProps {
  onExit: () => void;
}

const InlineStoryCreation: React.FC<InlineStoryCreationProps> = ({ onExit }) => {
  const navigate = useNavigate();
  const {
    currentSegment,
    storyHistory,
    showCostDialog,
    pendingAction,
    skipImage,
    apiCallsCount,
    error,
    selectedVoice,
    fullStoryAudioUrl,
    isCurrentlyGenerating,
    generateAudioMutation,
    showImageSettings,
    setShowCostDialog,
    setSkipImage,
    setSelectedVoice,
    handleSelectChoice,
    handleFinishStory,
    showConfirmation,
    confirmGeneration,
    resetStory,
    prompt,
    mode
  } = useInlineStoryGeneration();

  const handleStoryFinish = () => {
    handleFinishStory(false, (storyId: string) => {
      console.log('🎯 Story completed, redirecting to story view:', storyId);
      navigate(`/story/${storyId}`, { replace: true });
    });
  };

  // Show error state
  if (error && !isCurrentlyGenerating) {
    return (
      <StoryErrorState
        error={error}
        onRetry={resetStory}
        onExit={onExit}
      />
    );
  }

  // Show loading state only during initial generation without any content
  if (isCurrentlyGenerating && !currentSegment) {
    return (
      <StoryLoadingState
        apiCallsCount={apiCallsCount}
        onExit={onExit}
      />
    );
  }

  // Show complete story viewer when story is finished and has audio
  if (currentSegment?.isEnd && fullStoryAudioUrl) {
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
              {currentSegment.isEnd ? "Story Complete!" : "Your Story Continues"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Progressive Image Section - shows immediately with loading states */}
            <StoryImageSection
              imageUrl={currentSegment.imageUrl}
              imageGenerationStatus={currentSegment.imageGenerationStatus}
            />

            {/* Story Text - available immediately */}
            <StoryTextSection text={currentSegment.text} />

            {/* Choices - available immediately for user interaction */}
            {!currentSegment.isEnd && (
              <StoryChoicesSection
                choices={currentSegment.choices}
                isGenerating={false} // Don't disable choices during image generation
                onChoiceSelect={(choice) => showConfirmation('choice', choice)}
              />
            )}

            <StoryEndSection
              isEnd={currentSegment.isEnd}
              isGenerating={isCurrentlyGenerating}
              onFinishStory={handleStoryFinish}
              onExit={onExit}
            />

            {currentSegment.isEnd && !fullStoryAudioUrl && (
              <VoiceGenerationSection
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                onGenerateAudio={() => showConfirmation('audio')}
                isGenerating={generateAudioMutation.isPending}
              />
            )}

            {/* Show subtle indicator when image is generating in background */}
            {currentSegment.imageGenerationStatus === 'generating' && (
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
