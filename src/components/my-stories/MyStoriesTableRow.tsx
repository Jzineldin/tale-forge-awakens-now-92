
import React from 'react';
import { Link } from 'react-router-dom';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Volume2 } from 'lucide-react';
import { format } from 'date-fns';
import { StoryStatusBadge } from './StoryStatusBadge';
import { DeleteStoryDialog } from './DeleteStoryDialog';
import GenerateVoiceButton from './GenerateVoiceButton';
import { Story } from '@/types/stories';

interface MyStoriesTableRowProps {
  story: Story;
  onDelete: (id: string) => void;
  onRefresh?: () => void;
}

const MyStoriesTableRow: React.FC<MyStoriesTableRowProps> = ({ 
  story, 
  onDelete, 
  onRefresh 
}) => {
  const hasAudio = story.full_story_audio_url || story.audio_generation_status === 'in_progress';
  const canGenerateAudio = story.is_completed && !hasAudio;

  return (
    <TableRow className="hover:bg-slate-800/50 border-slate-700">
      <TableCell className="text-white font-medium">
        {story.title || 'Untitled Story'}
      </TableCell>
      <TableCell className="text-gray-300">
        {format(new Date(story.created_at), 'MMM dd, yyyy')}
      </TableCell>
      <TableCell>
        <StoryStatusBadge 
          story={story}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {hasAudio && (
            <div className="flex items-center text-green-400 text-sm">
              <Volume2 className="h-4 w-4 mr-1" />
              Audio
            </div>
          )}
          {canGenerateAudio && (
            <GenerateVoiceButton
              storyId={story.id}
              storyTitle={story.title || 'Untitled Story'}
              onSuccess={onRefresh}
            />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Link to={`/story/${story.id}`}>
            <Button size="sm" variant="outline" className="border-amber-500/40 text-amber-400 hover:bg-amber-500/20">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-red-500/40 text-red-400 hover:bg-red-500/20"
            onClick={() => onDelete(story.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MyStoriesTableRow;
