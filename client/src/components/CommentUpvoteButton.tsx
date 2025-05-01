import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp } from 'lucide-react';

interface CommentUpvoteButtonProps {
  commentId: number;
  userId: number; // In a real app, this would come from auth context
  storyId: number; // Needed for invalidating story comment queries
}

export default function CommentUpvoteButton({ commentId, userId, storyId }: CommentUpvoteButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get current upvote count for this comment
  const { data: upvoteCountData, isLoading: countLoading } = useQuery({
    queryKey: [`/api/comment/${commentId}/upvotes`],
  });
  
  const upvoteCount = upvoteCountData?.count || 0;
  
  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/comment/upvote', {
        userId,
        commentId,
      });
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/comment/${commentId}/upvotes`] });
      queryClient.invalidateQueries({ queryKey: [`/api/story/${storyId}/comments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/item/${storyId}/comments`] });
      
      // Show a toast
      toast({
        title: data.upvoted ? 'Upvoted' : 'Upvote removed',
        description: data.upvoted ? 'Comment upvoted successfully' : 'Your upvote has been removed',
      });
    },
    onError: (error) => {
      console.error('Error upvoting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to upvote the comment. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  const handleUpvote = () => {
    mutation.mutate();
  };
  
  const isLoading = countLoading || mutation.isPending;
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleUpvote}
      disabled={isLoading}
      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
    >
      <ThumbsUp size={12} />
      <span>{isLoading ? '...' : upvoteCount}</span>
    </Button>
  );
}