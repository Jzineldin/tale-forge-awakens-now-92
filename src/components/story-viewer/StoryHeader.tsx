
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Share2, CheckCircle } from 'lucide-react';
import { StoryWithSegments } from '@/types/stories';

interface StoryHeaderProps {
    story: StoryWithSegments;
    onPublish: () => void;
    isPublishing: boolean;
}

const StoryHeader: React.FC<StoryHeaderProps> = ({ story, onPublish, isPublishing }) => {
    return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mb-6">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/" className="text-amber-400 hover:text-amber-300">
                                <Home className="h-4 w-4" />
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-slate-400" />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/my-stories" className="text-amber-400 hover:text-amber-300">My Stories</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-slate-400" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-gray-300">{story.title || 'Untitled Story'}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-white">{story.title || 'Untitled Story'}</h1>
                <div className="flex items-center gap-3">
                    {story.is_public ? (
                        <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Published</span>
                        </div>
                    ) : (
                        <Button 
                            onClick={onPublish} 
                            disabled={isPublishing}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            {isPublishing ? 'Publishing...' : 'Publish Story'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StoryHeader;
