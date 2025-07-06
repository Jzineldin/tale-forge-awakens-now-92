
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Rewind, AlertCircle } from 'lucide-react';
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
    if (!audio || !src) return;

    console.log('🎵 AudioPlayer: Loading audio from:', src.substring(0, 100) + '...');
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    const setAudioData = () => {
      console.log('🎵 AudioPlayer: Audio data loaded, duration:', audio.duration);
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
        setIsLoading(false);
      }
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => {
      console.log('🎵 AudioPlayer: Audio started playing');
      setIsPlaying(true);
    };
    const onPause = () => {
      console.log('🎵 AudioPlayer: Audio paused');
      setIsPlaying(false);
    };

    const onLoadStart = () => {
      console.log('🎵 AudioPlayer: Load started');
      setIsLoading(true);
    };

    const onCanPlay = () => {
      console.log('🎵 AudioPlayer: Can play audio');
      setIsLoading(false);
      setHasError(false);
    };

    const onError = (e: Event) => {
      console.error('🎵 AudioPlayer: Error loading audio:', e);
      const audioElement = e.target as HTMLAudioElement;
      const error = audioElement.error;
      let message = 'Audio loading failed';
      
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            message = 'Audio loading was aborted';
            break;
          case error.MEDIA_ERR_NETWORK:
            message = 'Network error while loading audio';
            break;
          case error.MEDIA_ERR_DECODE:
            message = 'Audio decoding failed';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            message = 'Audio format not supported';
            break;
        }
      }
      
      setHasError(true);
      setErrorMessage(message);
      setIsLoading(false);
    };

    const onLoadedMetadata = () => {
      console.log('🎵 AudioPlayer: Metadata loaded');
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    // Add all event listeners
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onPause);
    audio.addEventListener('error', onError);

    // Set the source and preload
    audio.src = src;
    audio.preload = 'metadata';
    audio.load();

    return () => {
      // Cleanup: stop audio and remove listeners when component unmounts
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onPause);
      audio.removeEventListener('error', onError);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('🎵 AudioPlayer: Play failed:', error);
          setHasError(true);
          setErrorMessage('Playback failed');
        });
      }
    } else {
      audio.pause();
    }
  };
  
  const restartAudio = () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('🎵 AudioPlayer: Restart play failed:', error);
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

  const handleSeekChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
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
      <div className="flex items-center gap-4 w-full bg-red-900/20 border border-red-500/50 p-4 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
        <div className="flex-grow">
          <p className="text-red-200 font-medium">Audio Error</p>
          <p className="text-red-300 text-sm">{errorMessage}</p>
          <p className="text-red-400 text-xs mt-1">URL: {src.substring(0, 50)}...</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
          className="border-red-500/50 text-red-200 hover:bg-red-500/20"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-4 w-full bg-slate-700/50 border border-slate-500/50 p-4 rounded-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
        <span className="text-slate-200">Loading audio...</span>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2 md:gap-4 w-full bg-slate-800/90 border border-slate-600/50 p-4 rounded-lg shadow-sm backdrop-blur-sm">
        <audio ref={audioRef} preload="metadata" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={togglePlayPause} 
              className="flex-shrink-0 hover:bg-slate-700"
              disabled={hasError}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{isPlaying ? 'Pause' : 'Play'}</p></TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={restartAudio} 
              className="flex-shrink-0 hover:bg-slate-700"
              disabled={hasError}
            >
              <Rewind className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Restart</p></TooltipContent>
        </Tooltip>
        
        <div className="text-sm font-mono text-slate-300 w-12 text-center">
          {formatTime(currentTime)}
        </div>
        
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          className="flex-grow"
          onValueChange={handleSeekChange}
          disabled={hasError}
        />
        
        <div className="text-sm font-mono text-slate-300 w-12 text-center">
          {formatTime(duration)}
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMute} 
              className="flex-shrink-0 hover:bg-slate-700"
            >
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
