
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Rewind, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    const setAudioData = () => {
      console.log('Audio loaded successfully:', {
        duration: audio.duration,
        src: audio.src,
        readyState: audio.readyState
      });
      
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
        setIsLoading(false);
      }
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    
    const onError = (e: Event) => {
      console.error('Audio loading error:', {
        error: e,
        src: audio.src,
        networkState: audio.networkState,
        readyState: audio.readyState
      });
      
      setHasError(true);
      setIsLoading(false);
      setErrorMessage('Unable to load audio file');
    };

    const onLoadStart = () => {
      console.log('Audio loading started:', audio.src);
      setIsLoading(true);
    };

    const onCanPlay = () => {
      console.log('Audio can play:', {
        duration: audio.duration,
        readyState: audio.readyState
      });
      setIsLoading(false);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onPause);
    audio.addEventListener('error', onError);
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('canplay', onCanPlay);

    // Test if the audio URL is accessible
    fetch(src, { method: 'HEAD' })
      .then(response => {
        console.log('Audio URL accessibility test:', {
          url: src,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .catch(error => {
        console.error('Audio URL not accessible:', error);
        setHasError(true);
        setIsLoading(false);
        setErrorMessage(`Audio file not accessible: ${error.message}`);
      });

    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onPause);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (audio.paused) {
      audio.play().catch(err => {
        console.error('Play error:', err);
        setErrorMessage('Failed to play audio');
        setHasError(true);
      });
    } else {
      audio.pause();
    }
  };

  const restartAudio = () => {
    if (audioRef.current && !hasError) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.error('Restart error:', err);
        setErrorMessage('Failed to restart audio');
        setHasError(true);
      });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    setVolume(newVolume);
    audio.volume = newVolume;
    audio.muted = newVolume === 0;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
    if (!audio.muted && volume === 0) {
      handleVolumeChange([0.5]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Show error state
  if (hasError) {
    return (
      <div className="flex items-center gap-2 w-full bg-destructive/10 border border-destructive/20 p-2 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-destructive font-medium">Audio Error</p>
          <p className="text-xs text-destructive/80">{errorMessage}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="border-destructive/20 text-destructive hover:bg-destructive/10"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 w-full bg-muted border p-2 rounded-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary flex-shrink-0"></div>
        <div className="flex-1">
          <p className="text-sm font-medium">Loading audio...</p>
          <p className="text-xs text-muted-foreground">Please wait while the audio loads</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2 md:gap-4 w-full bg-background border p-2 rounded-lg shadow-sm">
        <audio ref={audioRef} src={src} preload="metadata" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={togglePlayPause} className="flex-shrink-0">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{isPlaying ? 'Pause' : 'Play'}</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={restartAudio} className="flex-shrink-0">
              <Rewind className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Restart</p></TooltipContent>
        </Tooltip>
        
        <div className="text-sm font-mono text-muted-foreground w-12 text-center">{formatTime(currentTime)}</div>
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          className="flex-grow"
          onValueChange={(value) => {
            if (audioRef.current) audioRef.current.currentTime = value[0];
          }}
        />
        <div className="text-sm font-mono text-muted-foreground w-12 text-center">{formatTime(duration)}</div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleMute} className="flex-shrink-0">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{isMuted ? 'Unmute' : 'Mute'}</p></TooltipContent>
        </Tooltip>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          className="w-16 md:w-24"
          onValueChange={handleVolumeChange}
        />
      </div>
    </TooltipProvider>
  );
};

export default AudioPlayer;
