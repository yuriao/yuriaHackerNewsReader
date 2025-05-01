import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Form schema
const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long (max 1000 characters)'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  storyId: number;
  parentId?: number; // Optional for nested comments
  userId: number; // This would come from auth context in a real app
  onSuccess?: () => void;
}

export default function CommentForm({ storyId, parentId, userId, onSuccess }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CommentFormData) => {
      // Prepare the full comment data
      const commentData = {
        userId,
        storyId,
        text: data.text,
        ...(parentId && { parentId }),
      };
      
      return apiRequest('POST', '/api/comments', commentData);
    },
    onSuccess: () => {
      // Invalidate queries to refresh the comment list
      queryClient.invalidateQueries({ queryKey: [`/api/story/${storyId}/comments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/item/${storyId}/comments`] });
      
      // Reset the form
      reset();
      
      // Show a success toast
      toast({
        title: 'Comment posted',
        description: 'Your comment has been posted successfully.',
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post your comment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Textarea
          {...register('text')}
          placeholder="Write your comment here..."
          className={`resize-none min-h-[100px] ${errors.text ? 'border-red-500' : ''}`}
        />
        {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>}
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}