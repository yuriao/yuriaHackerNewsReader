import axios from "axios";
import { Story, Comment, User } from "../../client/src/types";
import { timeAgo, extractDomain } from "../../client/src/lib/utils";

const API_BASE_URL = "https://hacker-news.firebaseio.com/v0";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Simple in-memory cache
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};

const fetchWithCache = async (url: string) => {
  const now = Date.now();
  
  // Return cached data if it exists and is not expired
  if (cache[url] && now - cache[url].timestamp < CACHE_TTL) {
    return cache[url].data;
  }
  
  // Fetch new data
  try {
    const response = await axios.get(url);
    
    // Cache the result
    cache[url] = {
      data: response.data,
      timestamp: now
    };
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export const getStoryIds = async (storyType: string) => {
  const validTypes = ["top", "new", "best", "ask", "show", "job"];
  if (!validTypes.includes(storyType)) {
    throw new Error(`Invalid story type: ${storyType}`);
  }
  
  return fetchWithCache(`${API_BASE_URL}/${storyType}stories.json`);
};

export const getItem = async (id: number) => {
  return fetchWithCache(`${API_BASE_URL}/item/${id}.json`);
};

export const getStory = async (id: number) => {
  const story = await getItem(id) as Story;
  if (!story) return null;
  
  return {
    ...story,
    timeAgo: timeAgo(story.time),
    domain: story.url ? extractDomain(story.url) : undefined
  };
};

export const getUser = async (id: string) => {
  return fetchWithCache(`${API_BASE_URL}/user/${id}.json`) as Promise<User>;
};

export const getStories = async (storyType: string, limit: number = 30) => {
  try {
    const ids = await getStoryIds(storyType);
    const limitedIds = ids.slice(0, limit);
    
    const stories = await Promise.all(
      limitedIds.map((id: number) => getStory(id))
    );
    
    // Filter out any null stories
    return stories.filter(Boolean);
  } catch (error) {
    console.error(`Error fetching ${storyType} stories:`, error);
    throw error;
  }
};

export const getComments = async (storyId: number) => {
  try {
    const story = await getStory(storyId);
    if (!story || !story.kids || story.kids.length === 0) {
      return [];
    }
    
    // Get all top-level comments
    const commentsPromises = story.kids.map(async (commentId: number) => {
      const comment = await getItem(commentId) as Comment;
      if (!comment) return null;
      
      return {
        ...comment,
        timeAgo: timeAgo(comment.time),
        children: []
      };
    });
    
    const comments = await Promise.all(commentsPromises);
    // Filter out any null comments (deleted or missing)
    return comments.filter(Boolean);
  } catch (error) {
    console.error(`Error fetching comments for story ${storyId}:`, error);
    throw error;
  }
};

// Helper function to recursively fetch comment replies up to a certain depth
export const getCommentWithReplies = async (commentId: number, depth: number = 2) => {
  if (depth <= 0) return null;
  
  try {
    const comment = await getItem(commentId) as Comment;
    if (!comment) return null;
    
    const enrichedComment = {
      ...comment,
      timeAgo: timeAgo(comment.time),
      children: []
    };
    
    if (comment.kids && comment.kids.length > 0 && depth > 1) {
      const childrenPromises = comment.kids.map(kidId => 
        getCommentWithReplies(kidId, depth - 1)
      );
      
      const children = await Promise.all(childrenPromises);
      enrichedComment.children = children.filter(Boolean);
    }
    
    return enrichedComment;
  } catch (error) {
    console.error(`Error fetching comment ${commentId}:`, error);
    return null;
  }
};

export const getStoryWithComments = async (storyId: number, commentDepth: number = 2) => {
  try {
    const story = await getStory(storyId);
    if (!story) return { story: null, comments: [] };
    
    if (!story.kids || story.kids.length === 0) {
      return { story, comments: [] };
    }
    
    const commentsPromises = story.kids.map(commentId => 
      getCommentWithReplies(commentId, commentDepth)
    );
    
    const comments = await Promise.all(commentsPromises);
    
    return {
      story,
      comments: comments.filter(Boolean)
    };
  } catch (error) {
    console.error(`Error fetching story with comments ${storyId}:`, error);
    throw error;
  }
};
