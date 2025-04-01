/**
 * Story detail page for the web application
 * Displays a single story with its comments
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStoryWithComments } from '../utils/api';
import { CommentWithDetails } from '../utils/types';
import CommentItem from '../components/CommentItem';

interface StoryDetailPageProps {
  id: number;
}

export default function StoryDetailPage({ id }: StoryDetailPageProps) {
  // Fetch story with comments
  const { data: storyData, isLoading, error, refetch } = useQuery({
    queryKey: ['story', id],
    queryFn: () => fetchStoryWithComments(id),
  });

  return (
    <div>
      {/* Loading state */}
      {isLoading && (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-24 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <p className="text-red-500 mb-4">Failed to load story</p>
          <button 
            onClick={() => refetch()}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Story content */}
      {!isLoading && !error && storyData && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{storyData.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              {storyData.url && (
                <a 
                  href={storyData.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mr-4"
                >
                  {storyData.domain}
                </a>
              )}
              
              <span className="mr-4">{storyData.score} points</span>
              <span className="mr-4">by {storyData.by}</span>
              <span>{storyData.timeAgo}</span>
            </div>
            
            {storyData.text && (
              <div 
                className="prose max-w-none mb-6 p-4 bg-gray-50 rounded-lg"
                dangerouslySetInnerHTML={{ __html: storyData.text }}
              />
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {storyData.descendants} {storyData.descendants === 1 ? 'Comment' : 'Comments'}
            </h2>
            
            {/* Comments list */}
            {storyData.comments && storyData.comments.length > 0 ? (
              <div className="space-y-6">
                {storyData.comments.map((comment: CommentWithDetails) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 p-4 bg-gray-50 rounded-lg">No comments yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}