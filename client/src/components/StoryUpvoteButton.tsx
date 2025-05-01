import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp } from 'lucide-react';

interface StoryUpvoteButtonProps {
  storyId: number;
  userId: number; // In a real app, this would come from auth context
}

export default function StoryUpvoteButton({ storyId, userId }: StoryUpvoteButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if user has already upvoted this story
  const { data: upvoteData, isLoading: checkingUpvote } = useQuery({
    queryKey: [`/api/story/${storyId}/upvoted/${userId}`],
  });
  
  // Get current upvote count
  const { data: upvoteCountData, isLoading: countLoading } = useQuery({
    queryKey: [`/api/story/${storyId}/upvotes`],
  });
  
  const hasUpvoted = upvoteData?.hasUpvoted || false;
  const upvoteCount = upvoteCountData?.count || 0;
  
  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/story/upvote', {
        userId,
        storyId,
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/story/${storyId}/upvoted/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/story/${storyId}/upvotes`] });
      
      // Show a toast
      toast({
        title: hasUpvoted ? 'Upvote removed' : 'Upvoted',
        description: hasUpvoted ? 'Your upvote has been removed' : 'Story upvoted successfully',
      });
    },
    onError: (error) => {
      console.error('Error upvoting story:', error);
      toast({
        title: 'Error',
        description: 'Failed to upvote the story. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const handleUpvote = () => {
    mutation.mutate();
  };
  
  const isLoading = checkingUpvote || countLoading || mutation.isPending;
  
  return (
    <div className="flex items-center">
      <Button
        variant={hasUpvoted ? "default" : "outline"}
        size="sm"
        onClick={handleUpvote}
        disabled={isLoading}
        className={`flex items-center gap-2 ${hasUpvoted ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
      >
        <ThumbsUp size={14} />
        <span>{isLoading ? '...' : upvoteCount}</span>
      </Button>
    </div>
  );
}