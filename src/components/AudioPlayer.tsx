
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Rewind } from 'lucide-react';
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onPause);

    // The line that attempted to autoplay has been removed.

    return () => {
      // Cleanup: stop audio and remove listeners when component unmounts
      if (audio) {
        audio.pause();
        // Detach the source to prevent further loading/playing after unmount
        audio.removeAttribute('src'); 
        audio.load();
      }
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onPause);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };
  
  const restartAudio = () => {
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }
  }

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
