import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { stripHtml } from '@/lib/utils';
import CommentUpvoteButton from './CommentUpvoteButton';
import CommentForm from './CommentForm';
import { MessageSquare, Reply } from 'lucide-react';
import { CommentWithDetails } from '@/types';

interface CommentItemProps {
  comment: CommentWithDetails;
  storyId: number;
  userId: number; // This would come from auth context in a real app
  depth?: number;
  maxDepth?: number;
}

export default function CommentItem({ 
  comment, 
  storyId,
  userId,
  depth = 0, 
  maxDepth = 4 
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  // Function to toggle reply form visibility
  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };
  
  // Function called after successful reply submission
  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };
  
  // Format the comment text (strip HTML if needed)
  const formattedText = stripHtml(comment.text || '');
  
  // Calculate indentation based on depth
  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, 16)}` : '';
  
  // Get the first letter of the commenter's username for the avatar
  const avatarInitial = (comment.by || 'A')[0].toUpperCase();
  
  return (
    <div className={`mb-4 ${indentClass}`}>
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-orange-100 text-orange-800">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.by}</span>
              <span className="text-xs text-gray-500">{comment.timeAgo}</span>
            </div>
            
            <div className="prose prose-sm max-w-none mb-3">
              <p>{formattedText}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <CommentUpvoteButton 
                commentId={comment.id} 
                userId={userId}
                storyId={storyId}
              />
              
              {depth < maxDepth && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleReplyForm}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  <Reply size={12} />
                  Reply
                </Button>
              )}
            </div>
            
            {showReplyForm && (
              <div className="mt-3">
                <CommentForm 
                  storyId={storyId}
                  parentId={comment.id}
                  userId={userId}
                  onSuccess={handleReplySuccess}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Render child comments recursively if they exist */}
      {comment.children && comment.children.length > 0 && depth < maxDepth && (
        <div className="pl-4 mt-2 border-l-2 border-gray-100">
          {comment.children.map((childComment) => (
            <CommentItem
              key={childComment.id}
              comment={childComment}
              storyId={storyId}
              userId={userId}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
      
      {/* If we've reached max depth but there are still children, show a "Show more" button */}
      {comment.children && comment.children.length > 0 && depth >= maxDepth && (
        <Button
          variant="link"
          className="mt-2 text-sm text-orange-500"
        >
          <MessageSquare size={12} className="mr-1" />
          Show {comment.children.length} more {comment.children.length === 1 ? 'reply' : 'replies'}
        </Button>
      )}
    </div>
  );
}