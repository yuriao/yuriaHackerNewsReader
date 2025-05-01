import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  getStoriesByType,
  getSingleStory,
  getStoryComments,
  getStoryWithCommentsHandler
} from "./controllers/storiesController";
import {
  createComment,
  getCommentsByStoryId,
  upvoteStory,
  getStoryUpvoteCount,
  hasUserUpvotedStory,
  upvoteComment,
  getCommentUpvoteCount
} from "./controllers/interactionController";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for Hacker News content
  
  // Get stories by type (top, new, best, ask, show, job)
  app.get("/api/stories/:type", getStoriesByType);
  
  // Get a single story by ID
  app.get("/api/story/:id", getSingleStory);
  
  // Get comments for a story
  app.get("/api/item/:id/comments", getStoryComments);
  
  // Get story with comments
  app.get("/api/item/:id/with-comments", getStoryWithCommentsHandler);

  // User Interaction Routes

  // Comments
  app.post("/api/comments", createComment);
  app.get("/api/story/:storyId/comments", getCommentsByStoryId);
  
  // Story Upvotes
  app.post("/api/story/upvote", upvoteStory);
  app.get("/api/story/:storyId/upvotes", getStoryUpvoteCount);
  app.get("/api/story/:storyId/upvoted/:userId", hasUserUpvotedStory);
  
  // Comment Upvotes
  app.post("/api/comment/upvote", upvoteComment);
  app.get("/api/comment/:commentId/upvotes", getCommentUpvoteCount);

  const httpServer = createServer(app);
  return httpServer;
}
