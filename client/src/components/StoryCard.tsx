/**
 * Story card component for the web application
 */

import React from 'react';
import { Link } from 'wouter';
import { StoryWithDetails } from '../utils/types';

interface StoryCardProps {
  story: StoryWithDetails;
  compact?: boolean;
}

export default function StoryCard({ story, compact = false }: StoryCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${compact ? 'p-4' : 'p-6'}`}>
      <Link href={`/story/${story.id}`}>
        <a className="block">
          <h3 className={`font-bold text-gray-900 hover:text-orange-500 ${compact ? 'text-base mb-2' : 'text-lg mb-3'}`}>
            {story.title}
          </h3>
        </a>
      </Link>
      
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <span className="mr-3">{story.score} points</span>
        <span className="mr-3">by {story.by}</span>
        <span>{story.timeAgo}</span>
      </div>
      
      {story.url && (
        <a 
          href={story.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-blue-500 inline-block mb-3"
        >
          {story.domain}
        </a>
      )}
      
      <div className="flex justify-between items-center">
        <Link href={`/story/${story.id}`}>
          <a className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            {story.descendants} {story.descendants === 1 ? 'comment' : 'comments'}
          </a>
        </Link>
        
        {!compact && (
          <Link href={`/story/${story.id}`}>
            <a className="text-sm text-gray-600 hover:text-orange-500">
              Read more →
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}