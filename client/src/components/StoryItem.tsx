/**
 * Story item component for the web application
 * Used in the stories list view
 */

import React from 'react';
import { Link } from 'wouter';
import { StoryWithDetails } from '../../../shared/types';

interface StoryItemProps {
  story: StoryWithDetails;
}

export default function StoryItem({ story }: StoryItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <Link href={`/story/${story.id}`}>
        <a className="block mb-2">
          <h3 className="text-lg font-bold text-gray-900 hover:text-orange-500">
            {story.title}
          </h3>
        </a>
      </Link>
      
      <div className="flex items-center flex-wrap text-sm text-gray-500 mb-2">
        <span className="mr-3">{story.score} points</span>
        <span className="mr-3">by {story.by}</span>
        <span className="mr-3">{story.timeAgo}</span>
        
        {story.url && (
          <a 
            href={story.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500"
          >
            {story.domain}
          </a>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Link href={`/story/${story.id}`}>
          <a className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            {story.descendants} {story.descendants === 1 ? 'comment' : 'comments'}
          </a>
        </Link>
        
        <div className="flex space-x-2">
          {story.url && (
            <a 
              href={story.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
            >
              Visit
            </a>
          )}
          
          <Link href={`/story/${story.id}`}>
            <a className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-md">
              Read
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}