import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertUserCommentSchema, insertStoryUpvoteSchema, insertCommentUpvoteSchema } from '@shared/schema';
import { z } from 'zod';

// Create a new comment
export const createComment = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = insertUserCommentSchema.parse(req.body);
    
    // Create the comment
    const comment = await storage.createComment(validatedData);
    
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get comments for a story
export const getCommentsByStoryId = async (req: Request, res: Response) => {
  try {
    const storyId = parseInt(req.params.storyId);
    
    if (isNaN(storyId)) {
      return res.status(400).json({ error: 'Invalid story ID' });
    }
    
    const comments = await storage.getCommentsByStoryId(storyId);
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};

// Upvote a story
export const upvoteStory = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = insertStoryUpvoteSchema.parse(req.body);
    
    // Check if user has already upvoted this story
    const hasUpvoted = await storage.hasUserUpvotedStory(validatedData.userId, validatedData.storyId);
    
    if (hasUpvoted) {
      // User has already upvoted, remove the upvote (toggle)
      await storage.removeStoryUpvote(validatedData.userId, validatedData.storyId);
      const upvoteCount = await storage.getStoryUpvotes(validatedData.storyId);
      return res.json({ upvoted: false, count: upvoteCount });
    }
    
    // Add the upvote
    await storage.upvoteStory(validatedData);
    const upvoteCount = await storage.getStoryUpvotes(validatedData.storyId);
    
    res.json({ upvoted: true, count: upvoteCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error('Error upvoting story:', error);
    res.status(500).json({ error: 'Failed to upvote story' });
  }
};

// Get upvote count for a story
export const getStoryUpvoteCount = async (req: Request, res: Response) => {
  try {
    const storyId = parseInt(req.params.storyId);
    
    if (isNaN(storyId)) {
      return res.status(400).json({ error: 'Invalid story ID' });
    }
    
    const count = await storage.getStoryUpvotes(storyId);
    res.json({ count });
  } catch (error) {
    console.error('Error getting upvote count:', error);
    res.status(500).json({ error: 'Failed to get upvote count' });
  }
};

// Check if user has upvoted a story
export const hasUserUpvotedStory = async (req: Request, res: Response) => {
  try {
    const storyId = parseInt(req.params.storyId);
    const userId = parseInt(req.params.userId);
    
    if (isNaN(storyId) || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid story or user ID' });
    }
    
    const hasUpvoted = await storage.hasUserUpvotedStory(userId, storyId);
    res.json({ hasUpvoted });
  } catch (error) {
    console.error('Error checking if user has upvoted story:', error);
    res.status(500).json({ error: 'Failed to check if user has upvoted story' });
  }
};

// Upvote a comment
export const upvoteComment = async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = insertCommentUpvoteSchema.parse(req.body);
    
    // Check if user has already upvoted this comment
    const hasUpvoted = await storage.hasUserUpvotedComment(validatedData.userId, validatedData.commentId);
    
    if (hasUpvoted) {
      // User has already upvoted, remove the upvote (toggle)
      await storage.removeCommentUpvote(validatedData.userId, validatedData.commentId);
      const upvoteCount = await storage.getCommentUpvotes(validatedData.commentId);
      return res.json({ upvoted: false, count: upvoteCount });
    }
    
    // Add the upvote
    await storage.upvoteComment(validatedData);
    const upvoteCount = await storage.getCommentUpvotes(validatedData.commentId);
    
    res.json({ upvoted: true, count: upvoteCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error('Error upvoting comment:', error);
    res.status(500).json({ error: 'Failed to upvote comment' });
  }
};

// Get upvote count for a comment
export const getCommentUpvoteCount = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId);
    
    if (isNaN(commentId)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }
    
    const count = await storage.getCommentUpvotes(commentId);
    res.json({ count });
  } catch (error) {
    console.error('Error getting comment upvote count:', error);
    res.status(500).json({ error: 'Failed to get comment upvote count' });
  }
};