
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Calendar, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  description: string;
  story_mode: string;
  is_completed: boolean;
  is_public: boolean;
  created_at: string;
  segment_count?: number;
}

const MyStories: React.FC = () => {
  const navigate = useNavigate();

  const { data: stories, isLoading, refetch } = useQuery({
    queryKey: ['user-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          description,
          story_mode,
          is_completed,
          is_public,
          created_at,
          story_segments!inner(id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(story => ({
        ...story,
        segment_count: story.story_segments?.length || 0
      })) as Story[] || [];
    }
  });

  const handleDeleteStory = async (storyId: string) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      toast.success('Story deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGenreEmoji = (storyMode: string) => {
    const emojiMap: { [key: string]: string } = {
      'child-adapted': '👶',
      'horror-story': '👻',
      'educational': '📚',
      'epic-fantasy': '🏰',
      'sci-fi-thriller': '🚀',
      'mystery': '🕵️',
      'romantic-drama': '💕',
      'adventure-quest': '🗺️'
    };
    return emojiMap[storyMode] || '📖';
  };

  return (
    <div 
      className="min-h-screen bg-slate-900"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('/images/Flux_Dev_Lonely_astronaut_sitting_on_a_pile_of_books_in_space__0.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
              My <span className="text-amber-400">Stories</span>
            </h1>
            <p className="text-xl text-gray-300">
              Your personal collection of interactive adventures
            </p>
          </div>
          <Button
            onClick={() => navigate('/create/genre')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Story
          </Button>
        </div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-slate-800/90 border-slate-600 backdrop-blur-sm animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-600 rounded mb-2"></div>
                  <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-slate-600 rounded mb-2"></div>
                  <div className="h-4 bg-slate-600 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card 
                key={story.id}
                className="bg-slate-800/90 border-slate-600 backdrop-blur-sm hover:border-amber-400/60 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/story/${story.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getGenreEmoji(story.story_mode)}</span>
                      <div>
                        <CardTitle className="text-white text-lg font-serif group-hover:text-amber-400 transition-colors">
                          {story.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {story.story_mode.replace('-', ' ')}
                          </Badge>
                          {story.is_completed && (
                            <Badge className="text-xs bg-green-600">Complete</Badge>
                          )}
                          {story.is_public && (
                            <Badge className="text-xs bg-blue-600">Public</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStory(story.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(story.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {story.segment_count} segments
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/90 border-slate-600 backdrop-blur-sm text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-amber-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No Stories Yet</h3>
              <p className="text-gray-300 mb-6">
                Start your storytelling journey by creating your first interactive story!
              </p>
              <Button
                onClick={() => navigate('/create/genre')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Story
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyStories;
