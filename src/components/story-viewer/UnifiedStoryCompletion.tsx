
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceSelector, voices } from '@/components/VoiceSelector';
import { useGenerateFullStoryAudio } from '@/hooks/useGenerateFullStoryAudio';
import { Loader2, Mic, Eye, Sparkles, ImageIcon, CheckCircle } from 'lucide-react';
import { StorySegmentRow } from '@/types/stories';
import AudioPlayer from '@/components/AudioPlayer';
import StorySlideshow from './StorySlideshow';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UnifiedStoryCompletionProps {
    storyId: string;
    segments: StorySegmentRow[];
    fullStoryAudioUrl?: string;
    audioGenerationStatus?: string;
}

const UnifiedStoryCompletion: React.FC<UnifiedStoryCompletionProps> = ({
    storyId,
    segments,
    fullStoryAudioUrl,
    audioGenerationStatus
}) => {
    const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
    const [showSlideshow, setShowSlideshow] = useState(false);
    const [isGeneratingMissingImage, setIsGeneratingMissingImage] = useState(false);
    const [missingImageFixed, setMissingImageFixed] = useState(false);
    
    const generateAudioMutation = useGenerateFullStoryAudio();

    // Calculate story stats
    const totalWords = segments.reduce((acc, segment) => acc + (segment.segment_text?.split(' ').length || 0), 0);
    const segmentsWithImages = segments.filter(s => s.image_url && s.image_url !== '/placeholder.svg').length;
    const hasImages = segmentsWithImages > 0;
    
    // Check if last segment is missing image when others have images
    const lastSegment = segments[segments.length - 1];
    const needsLastImage = hasImages && (!lastSegment?.image_url || lastSegment.image_url === '/placeholder.svg');

    const isGenerating = generateAudioMutation.isPending || audioGenerationStatus === 'in_progress';
    const hasAudio = audioGenerationStatus === 'completed' && fullStoryAudioUrl;
    const canGenerate = !isGenerating && (!audioGenerationStatus || audioGenerationStatus === 'not_started' || audioGenerationStatus === 'failed');

    // Auto-generate missing image for last segment
    useEffect(() => {
        if (needsLastImage && !isGeneratingMissingImage && !missingImageFixed) {
            handleGenerateMissingImage();
        }
    }, [needsLastImage, isGeneratingMissingImage, missingImageFixed]);

    const handleGenerateMissingImage = async () => {
        if (!lastSegment || isGeneratingMissingImage) return;
        
        setIsGeneratingMissingImage(true);
        console.log('🎨 Generating missing image for final segment:', lastSegment.id);

        try {
            const { error } = await supabase.functions.invoke('generate-story-segment', {
                body: {
                    action: 'generate_image_only',
                    segmentId: lastSegment.id,
                    storyId: storyId,
                    segmentText: lastSegment.segment_text
                }
            });

            if (error) throw error;
            
            toast.success('Generating final image...');
            setMissingImageFixed(true);
        } catch (error) {
            console.error('Failed to generate missing image:', error);
            toast.error('Failed to generate final image');
        } finally {
            setIsGeneratingMissingImage(false);
        }
    };

    const handleGenerateVoice = () => {
        generateAudioMutation.mutate({ storyId, voiceId: selectedVoice });
    };

    const handleWatchStory = () => {
        setShowSlideshow(true);
    };

    return (
        <>
            <div className="mt-8 space-y-8">
                {/* Story Complete Header */}
                <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-purple-900/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl text-amber-300 flex items-center justify-center gap-3">
                            <Sparkles className="h-8 w-8" />
                            🎉 Story Complete!
                        </CardTitle>
                        <p className="text-slate-300 text-lg mt-2">
                            Your adventure concluded with <strong>{segments.length} chapters</strong>, 
                            <strong> {totalWords} words</strong>, and <strong>{segmentsWithImages} images</strong>
                        </p>
                    </CardHeader>
                </Card>

                {/* Step 1: Story Content Preview */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-slate-200 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            Step 1: Your Complete Story
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 max-h-96 overflow-y-auto">
                            {segments.map((segment, index) => (
                                <div key={segment.id} className="flex gap-4 p-4 bg-slate-900/50 rounded-lg">
                                    {/* Image */}
                                    <div className="flex-shrink-0 w-24 h-24">
                                        {segment.image_url && segment.image_url !== '/placeholder.svg' ? (
                                            <img 
                                                src={segment.image_url} 
                                                alt={`Chapter ${index + 1}`}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-700 rounded flex items-center justify-center">
                                                {index === segments.length - 1 && isGeneratingMissingImage ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                                                ) : (
                                                    <ImageIcon className="h-4 w-4 text-slate-500" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {/* Text */}
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-200 mb-2">Chapter {index + 1}</h4>
                                        <p className="text-slate-300 text-sm line-clamp-3">
                                            {segment.segment_text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Step 2: Voice Generation */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-slate-200 flex items-center gap-2">
                            {hasAudio ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                                <span className="h-5 w-5 bg-slate-600 rounded-full flex items-center justify-center text-xs">2</span>
                            )}
                            Voice Narration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {hasAudio ? (
                            <div className="space-y-4">
                                <p className="text-green-300 mb-4">🎵 Your story audio is ready!</p>
                                <AudioPlayer src={fullStoryAudioUrl} />
                            </div>
                        ) : canGenerate ? (
                            <div className="space-y-4">
                                <p className="text-slate-400 mb-4">
                                    Add voice narration to bring your story to life
                                </p>
                                <VoiceSelector 
                                    selectedVoice={selectedVoice} 
                                    onVoiceChange={setSelectedVoice}
                                />
                                <Button 
                                    onClick={handleGenerateVoice}
                                    disabled={isGenerating}
                                    className="bg-amber-600 hover:bg-amber-700"
                                    size="lg"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating Voice...
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="mr-2 h-4 w-4" />
                                            Generate Voice Narration
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : isGenerating ? (
                            <div className="text-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-400" />
                                <p className="text-blue-300 font-medium">Creating your voice narration...</p>
                                <p className="text-sm text-blue-200/70 mt-1">This may take a few minutes</p>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-red-300 mb-4">Voice generation failed. Please try again.</p>
                                <Button 
                                    onClick={handleGenerateVoice}
                                    variant="outline"
                                    className="border-red-500/50 text-red-300 hover:bg-red-500/20"
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Step 3: Watch Story */}
                <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
                    <CardHeader>
                        <CardTitle className="text-slate-200 flex items-center gap-2">
                            <span className="h-5 w-5 bg-purple-600 rounded-full flex items-center justify-center text-xs">3</span>
                            Experience Your Story
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-slate-300 mb-6">
                            Watch your complete story as an immersive slideshow experience
                        </p>
                        <Button 
                            onClick={handleWatchStory}
                            size="lg"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 text-lg"
                        >
                            <Eye className="mr-2 h-6 w-6" />
                            🎬 Watch Your Story
                        </Button>
                        {hasAudio && (
                            <p className="text-purple-300 text-sm mt-2">
                                ✨ Complete with voice narration
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Slideshow Modal */}
            <StorySlideshow
                segments={segments}
                fullStoryAudioUrl={fullStoryAudioUrl}
                isOpen={showSlideshow}
                onClose={() => setShowSlideshow(false)}
            />
        </>
    );
};

export default UnifiedStoryCompletion;
