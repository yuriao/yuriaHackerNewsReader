/**
 * Stories page for the web application
 * Displays a list of stories by type (top, new, best, ask, show, job)
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStories } from '../utils/api';
import { StoryType } from '../utils/types';
import StoryItem from '../components/StoryItem';

interface StoriesPageProps {
  type: StoryType;
}

export default function StoriesPage({ type }: StoriesPageProps) {
  // Fetch stories based on type
  const { data: stories, isLoading, error, refetch } = useQuery({
    queryKey: ['stories', type],
    queryFn: () => fetchStories(type, 30),
  });

  // Generate page title based on story type
  const getPageTitle = () => {
    switch (type) {
      case 'top':
        return 'Top Stories';
      case 'new':
        return 'New Stories';
      case 'best':
        return 'Best Stories';
      case 'ask':
        return 'Ask HN';
      case 'show':
        return 'Show HN';
      case 'job':
        return 'Jobs';
      default:
        return 'Stories';
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
        
        <button 
          onClick={() => refetch()}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
        >
          Refresh
        </button>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-24 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <p className="text-red-500 mb-4">Failed to load stories</p>
          <button 
            onClick={() => refetch()}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Stories list */}
      {!isLoading && !error && stories && (
        <div className="space-y-4">
          {stories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No stories found</p>
          ) : (
            stories.map(story => (
              <StoryItem key={story.id} story={story} />
            ))
          )}
        </div>
      )}
    </div>
  );
}