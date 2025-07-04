
import React from 'react';
import { useStoryMigration } from '@/hooks/useStoryMigration';

interface StoryMigrationWrapperProps {
  children: React.ReactNode;
}

const StoryMigrationWrapper: React.FC<StoryMigrationWrapperProps> = ({ children }) => {
  // The hook handles migration automatically when user logs in
  useStoryMigration();
  
  return <>{children}</>;
};

export default StoryMigrationWrapper;
