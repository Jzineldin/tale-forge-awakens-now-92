
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { VoiceSelector, voices } from '@/components/VoiceSelector';
import { useGenerateFullStoryAudio } from '@/hooks/useGenerateFullStoryAudio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, Maximize2, Sparkles, Play, Eye } from 'lucide-react';
import { StorySegmentRow } from '@/types/stories';
import AudioPlayer from '@/components/AudioPlayer';
import FullStoryText from './FullStoryText';
import StorySlideshow from './StorySlideshow';

interface StoryCompletionControlsProps {
    storyId: string;
    segments?: StorySegmentRow[];
    fullStoryAudioUrl?: string;
    audioGenerationStatus?: string;
    onRestart?: () => void;
}

const StoryCompletionControls: React.FC<StoryCompletionControlsProps> = ({ 
    storyId, 
    segments = [],
    fullStoryAudioUrl,
    audioGenerationStatus,
    onRestart 
}) => {
    const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
    const [showSlideshow, setShowSlideshow] = useState(false);
    
    const generateAudioMutation = useGenerateFullStoryAudio();

    console.log('StoryCompletionControls Debug:', {
        storyId,
        segmentsCount: segments.length,
        audioStatus: audioGenerationStatus,
        hasAudioUrl: !!fullStoryAudioUrl,
        segmentsWithImages: segments.filter(s => s.image_generation_status === 'completed').length
    });

    // Auto-launch slideshow when audio generation completes
    useEffect(() => {
        if (fullStoryAudioUrl && audioGenerationStatus === 'completed' && !showSlideshow) {
            console.log('🎵 Audio generation completed, auto-launching slideshow');
            setTimeout(() => setShowSlideshow(true), 1000); // Small delay for better UX
        }
    }, [fullStoryAudioUrl, audioGenerationStatus, showSlideshow]);

    const handleGenerateAudio = () => {
        generateAudioMutation.mutate({ storyId, voiceId: selectedVoice });
    };

    const handleWatchStory = () => {
        console.log('🎬 Launching slideshow experience');
        setShowSlideshow(true);
    };

    const isAnyJobRunning = generateAudioMutation.isPending || audioGenerationStatus === 'in_progress';
    const canGenerateAudio = audioGenerationStatus === 'not_started' || audioGenerationStatus === 'failed' || !audioGenerationStatus;
    const hasCompletedAudio = audioGenerationStatus === 'completed' && fullStoryAudioUrl;
    const hasImages = segments.filter(s => s.image_generation_status === 'completed').length > 0;

    return (
        <>
            <div className="w-full max-w-4xl mx-auto space-y-6">
                {/* Story Complete Announcement */}
                <Card className="border-slate-600 bg-slate-800/50">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl flex items-center justify-center gap-2 text-green-400">
                            <CheckCircle className="h-6 w-6" />
                            Story Complete!
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                            🎉 Congratulations! Your interactive story has reached its conclusion.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center space-y-3">
                            <p className="text-slate-400">
                                Your story is complete with {segments.length} chapters and {segments.filter(s => s.image_generation_status === 'completed').length} generated images.
                            </p>
                            
                            {/* Prominent Watch Story Button - Always Visible */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button 
                                    onClick={handleWatchStory}
                                    size="lg"
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3"
                                >
                                    <Eye className="mr-2 h-5 w-5" />
                                    🎬 Watch Your Story
                                </Button>
                                
                                {hasCompletedAudio && (
                                    <Button 
                                        onClick={handleWatchStory}
                                        size="lg"
                                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3"
                                    >
                                        <Play className="mr-2 h-5 w-5" />
                                        🎵 Watch with Audio
                                    </Button>
                                )}
                            </div>
                            
                            <p className="text-sm text-slate-500">
                                Experience your story as a full-screen slideshow with images and narration
                            </p>
                        </div>
                        
                        <Separator className="bg-slate-600" />
                        
                        {onRestart && (
                            <Button onClick={onRestart} variant="outline" className="w-full">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Start a New Story
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Audio Generation Section */}
                {canGenerateAudio && (
                    <Card className="border-amber-500/30 bg-amber-900/20">
                        <CardHeader>
                            <CardTitle className="text-amber-300">🔊 Add Voice Narration</CardTitle>
                            <CardDescription>Generate professional voice narration for the full slideshow experience</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />
                            <Button 
                                onClick={handleGenerateAudio} 
                                disabled={isAnyJobRunning}
                                className="w-full bg-amber-600 hover:bg-amber-700"
                                size="lg"
                            >
                                {generateAudioMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                        Starting Generation...
                                    </>
                                ) : (
                                    <>
                                        🎙️ Generate Voice Narration
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-amber-200/70 text-center">
                                This will generate audio for your entire story (~2-5 minutes)
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Loading State */}
                {audioGenerationStatus === 'in_progress' && (
                    <Card className="border-blue-500/30 bg-blue-900/20">
                        <CardContent className="text-center p-6">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-400" />
                            <p className="text-blue-300 font-medium">Generating full story audio...</p>
                            <p className="text-sm text-blue-200/70 mt-1">This may take a few minutes. The slideshow will auto-launch when ready!</p>
                        </CardContent>
                    </Card>
                )}

                {/* Failed State */}
                {audioGenerationStatus === 'failed' && (
                    <Card className="border-red-500/30 bg-red-900/20">
                        <CardContent className="p-4 text-center">
                            <div className="p-4 border border-red-500/30 rounded-lg">
                                <span className="text-red-300">Audio generation failed. You can still watch your story without audio, or try generating audio again.</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Generated Audio Player */}
                {hasCompletedAudio && (
                    <Card key={`audio-${fullStoryAudioUrl}-${Date.now()}`} className="border-green-500/30 bg-green-900/20">
                        <CardHeader>
                            <CardTitle className="text-green-300">🎵 Your Story Audio is Ready!</CardTitle>
                            <CardDescription>Your story now has professional voice narration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AudioPlayer src={fullStoryAudioUrl} />
                            
                            <Button 
                                onClick={handleWatchStory}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                                size="lg"
                            >
                                <Maximize2 className="mr-2 h-4 w-4" />
                                🎬 Launch Full Slideshow Experience
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Full Story Text - Collapsible */}
                {segments.length > 0 && (
                    <FullStoryText segments={segments} />
                )}
            </div>

            {/* Enhanced Slideshow Modal */}
            <StorySlideshow
                segments={segments}
                fullStoryAudioUrl={fullStoryAudioUrl}
                isOpen={showSlideshow}
                onClose={() => setShowSlideshow(false)}
            />
        </>
    );
}

export default StoryCompletionControls;
