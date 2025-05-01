import { Request, Response } from "express";
import {
  getStories,
  getStory,
  getStoryWithComments,
  getComments
} from "../api/hackerNews";

export const getStoriesByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
    
    const stories = await getStories(type, limit);
    res.json(stories);
  } catch (error) {
    console.error("Error in getStoriesByType:", error);
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};

export const getSingleStory = async (req: Request, res: Response) => {
  try {
    const storyId = parseInt(req.params.id);
    if (isNaN(storyId)) {
      return res.status(400).json({ message: "Invalid story ID" });
    }
    
    const story = await getStory(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    
    res.json(story);
  } catch (error) {
    console.error("Error in getSingleStory:", error);
    res.status(500).json({ message: "Failed to fetch story" });
  }
};

export const getStoryComments = async (req: Request, res: Response) => {
  try {
    const storyId = parseInt(req.params.id);
    if (isNaN(storyId)) {
      return res.status(400).json({ message: "Invalid story ID" });
    }
    
    const comments = await getComments(storyId);
    res.json(comments);
  } catch (error) {
    console.error("Error in getStoryComments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const getStoryWithCommentsHandler = async (req: Request, res: Response) => {
  try {
    const storyId = parseInt(req.params.id);
    if (isNaN(storyId)) {
      return res.status(400).json({ message: "Invalid story ID" });
    }
    
    const depth = req.query.depth ? parseInt(req.query.depth as string) : 2;
    const result = await getStoryWithComments(storyId, depth);
    
    if (!result.story) {
      return res.status(404).json({ message: "Story not found" });
    }
    
    res.json(result);
  } catch (error) {
    console.error("Error in getStoryWithComments:", error);
    res.status(500).json({ message: "Failed to fetch story with comments" });
  }
};
