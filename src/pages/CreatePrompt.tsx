
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Sparkles, Home } from 'lucide-react';
import { toast } from 'sonner';

const CreatePrompt: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const genre = searchParams.get('genre');
    if (!genre) {
      navigate('/create/genre');
      return;
    }
    setSelectedGenre(genre);
  }, [searchParams, navigate]);

  const genrePrompts: Record<string, string[]> = {
    'child-adapted': [
      'You find a magical crayon that brings everything you draw to life in your backyard.',
      'A friendly dragon visits your school and needs help finding its way home.',
      'You discover that your pet hamster can actually talk, but only to you.'
    ],
    'horror-story': [
      'You inherit an old mansion where every mirror shows a different reflection than your own.',
      'The antique music box in your attic plays a melody that makes people disappear.',
      'You work the night shift at a museum where the exhibits come alive after midnight.'
    ],
    'educational': [
      'You time travel to ancient Egypt and must help build the pyramids using mathematical principles.',
      'A mysterious scientist shrinks you down to explore the human body from the inside.',
      'You become the apprentice to a Renaissance inventor who needs help with their latest creation.'
    ],
    'epic-fantasy': [
      'You discover you are the last heir to a magical kingdom hidden beneath your city.',
      'An ancient dragon awakens and claims you are the chosen one mentioned in an old prophecy.',
      'You find a magical sword in your grandmother\'s attic that transports you to a realm under siege.'
    ],
    'sci-fi-thriller': [
      'You wake up on a space station with no memory of how you got there, and the AI seems hostile.',
      'Your new smartphone starts receiving messages from your future self warning of danger.',
      'You discover that your dreams are actually glimpses into parallel universes.'
    ],
    'mystery': [
      'You inherit your detective grandfather\'s office and find his unsolved case files.',
      'Every book you check out from the library contains a hidden message meant just for you.',
      'You notice that everyone in your small town disappears for exactly one hour every Tuesday.'
    ],
    'romantic-drama': [
      'You keep meeting the same stranger in different cities around the world.',
      'A love letter meant for someone else accidentally gets delivered to your door.',
      'You can hear the thoughts of your soulmate, but you\'ve never met them.'
    ],
    'adventure-quest': [
      'You find a treasure map hidden in the pages of an old library book.',
      'Your grandfather\'s compass doesn\'t point north—it points to adventure.',
      'You receive an invitation to join a secret society of modern-day explorers.'
    ]
  };

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const handleBeginAdventure = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a story prompt or select one from the suggestions');
      return;
    }

    // For now, navigate to the existing story creation flow
    // In the future, this would create a new story and navigate to /story/:id
    navigate(`/create-story?genre=${selectedGenre}&prompt=${encodeURIComponent(prompt)}`);
  };

  const genreDisplayNames: Record<string, string> = {
    'child-adapted': '👶 Child Adapted',
    'horror-story': '👻 Horror Story',
    'educational': '📚 Educational',
    'epic-fantasy': '🏰 Epic Fantasy',
    'sci-fi-thriller': '🚀 Sci-Fi Thriller',
    'mystery': '🕵️ Mystery',
    'romantic-drama': '💕 Romantic Drama',
    'adventure-quest': '🗺️ Adventure Quest'
  };

  if (!selectedGenre) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-slate-900"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/images/Flux_Dev_Lonely_astronaut_sitting_on_a_pile_of_books_in_space__0.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 text-white hover:text-amber-400"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/create/genre')}
            className="absolute top-8 left-24 text-white hover:text-amber-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
            Your <span className="text-amber-400">{genreDisplayNames[selectedGenre]}</span> Adventure
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Describe your story idea or choose from our suggestions below
          </p>
        </div>

        {/* Story Prompt Input */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-slate-800/70 border-slate-600 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-xl font-serif">
                Your Story Beginning
              </CardTitle>
              <CardDescription className="text-gray-300">
                Write your own prompt or select one from the suggestions below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="A mysterious letter arrives at your door on a stormy night..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] text-lg p-4 bg-slate-700/50 border-slate-500 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20 backdrop-blur-sm resize-none rounded-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Story Suggestions */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center font-serif">
            Need Inspiration?
          </h3>
          <div className="grid gap-4">
            {genrePrompts[selectedGenre]?.map((suggestion, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  prompt === suggestion 
                    ? 'border-2 border-amber-400 bg-slate-800/90' 
                    : 'border border-slate-600 hover:border-amber-400/60 bg-slate-800/70'
                } backdrop-blur-sm`}
                onClick={() => handlePromptSelect(suggestion)}
              >
                <CardContent className="p-4">
                  <p className="text-gray-300 leading-relaxed">
                    {suggestion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Begin Adventure Button */}
        <div className="text-center">
          <Button
            onClick={handleBeginAdventure}
            disabled={!prompt.trim()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-12 py-4 text-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Begin My {genreDisplayNames[selectedGenre].split(' ').slice(1).join(' ')} Adventure
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePrompt;
