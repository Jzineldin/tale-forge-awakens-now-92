
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { useStoryMigration } from '@/hooks/useStoryMigration';
import { TempStory } from '@/utils/localStorageStories';

interface SaveToAccountButtonProps {
  story: TempStory;
  onSuccess?: () => void;
}

const SaveToAccountButton: React.FC<SaveToAccountButtonProps> = ({ story, onSuccess }) => {
  const { user } = useAuth();
  const { migrateSingleStory } = useStoryMigration();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToAccount = async () => {
    if (!user) {
      return;
    }

    setIsSaving(true);
    try {
      const success = await migrateSingleStory(story);
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSaveToAccount}
      disabled={!user || isSaving}
      size="sm"
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <User className="h-4 w-4 mr-2" />
      )}
      {isSaving ? 'Saving...' : user ? 'Save to Account' : 'Log in to Save'}
    </Button>
  );
};

export default SaveToAccountButton;
