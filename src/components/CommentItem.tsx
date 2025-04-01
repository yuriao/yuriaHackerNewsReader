/**
 * Comment item component for the web application
 */

import React, { useState } from 'react';
import { CommentWithDetails } from '../utils/types';

interface CommentItemProps {
  comment: CommentWithDetails;
  depth?: number;
}

export default function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate padding based on depth level
  const paddingLeft = Math.min(depth * 20, 60);
  
  // Toggle comment collapsed state
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className="comment-item" 
      style={{ marginLeft: `${paddingLeft}px` }}
    >
      <div className={`border-l-2 border-gray-200 pl-4 ${depth > 0 ? 'mt-4' : ''}`}>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <span className="font-medium mr-2">{comment.by}</span>
          <span>{comment.timeAgo}</span>
          
          {(comment.children && comment.children.length > 0) && (
            <button 
              onClick={toggleCollapsed}
              className="ml-2 text-xs px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded"
            >
              {isCollapsed ? 'Show' : 'Hide'} {comment.children.length} {comment.children.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
        
        <div 
          className="prose prose-sm max-w-none text-gray-800 mb-2"
          dangerouslySetInnerHTML={{ __html: comment.text || 'Comment deleted' }}
        />
        
        {!isCollapsed && comment.children && comment.children.length > 0 && (
          <div className="mt-2">
            {comment.children.map(childComment => (
              <CommentItem 
                key={childComment.id} 
                comment={childComment} 
                depth={depth + 1} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}