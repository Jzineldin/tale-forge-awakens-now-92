
import React from 'react';
import { Story } from '@/types/stories';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MyStoriesTableRow from './MyStoriesTableRow';

interface MyStoriesTableProps {
    stories: Story[];
    onSetStoryToDelete: (storyId: string) => void;
    onRefresh?: () => void;
}

export const MyStoriesTable: React.FC<MyStoriesTableProps> = ({ stories, onSetStoryToDelete, onRefresh }) => {
    return (
        <div className="rounded-lg border border-slate-700/50">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-700">
                        <TableHead className="text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-300">Created</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Audio</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stories.map((story) => (
                        <MyStoriesTableRow 
                            key={story.id} 
                            story={story} 
                            onDelete={onSetStoryToDelete}
                            onRefresh={onRefresh}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
