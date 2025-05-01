/**
 * Shared API functions for accessing Hacker News data
 * This file can be used by both web and mobile apps with appropriate config
 */

import { Story, StoryType, Comment } from './types';
import { timeAgo, extractDomain } from './utils';

// Base URL for the Hacker News API
const HN_BASE_URL = 'https://hacker-news.firebaseio.com/v0';

// Cache to store fetched items and reduce API calls
const cache: { [key: string]: any } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache time

/**
 * Fetch story IDs by story type (top, new, best, etc.)
 */
export const fetchStoryIds = async (type: StoryType): Promise<number[]> => {
  const endpoint = `${HN_BASE_URL}/${type}stories.json`;
  const cacheKey = `stories_${type}`;
  
  // Check cache first
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }
  
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Failed to fetch ${type} story IDs`);
    
    const data = await response.json();
    
    // Update cache
    cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${type} story IDs:`, error);
    return [];
  }
};

/**
 * Fetch a single item (story or comment) by ID
 */
export const fetchItem = async (id: number): Promise<any> => {
  const endpoint = `${HN_BASE_URL}/item/${id}.json`;
  const cacheKey = `item_${id}`;
  
  // Check cache first
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }
  
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Failed to fetch item ${id}`);
    
    const data = await response.json();
    
    // Update cache
    cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    return null;
  }
};

/**
 * Fetch stories by type with limit
 */
export const fetchStories = async (type: StoryType, limit: number = 30): Promise<Story[]> => {
  try {
    const storyIds = await fetchStoryIds(type);
    const limitedIds = storyIds.slice(0, limit);
    
    const storiesPromises = limitedIds.map(id => fetchItem(id));
    const stories = await Promise.all(storiesPromises);
    
    // Filter out any null values and enhance stories with additional properties
    return stories
      .filter(story => story !== null)
      .map(story => ({
        ...story,
        domain: story.url ? extractDomain(story.url) : '',
        timeAgo: timeAgo(story.time)
      }));
  } catch (error) {
    console.error(`Error fetching ${type} stories:`, error);
    return [];
  }
};

/**
 * Fetch a story with comments
 */
export const fetchStoryWithComments = async (id: number, depth: number = 2): Promise<any> => {
  try {
    const story = await fetchItem(id);
    if (!story) return null;
    
    // Enhance story with additional properties
    const enhancedStory = {
      ...story,
      domain: story.url ? extractDomain(story.url) : '',
      timeAgo: timeAgo(story.time)
    };
    
    // If the story has comments, fetch them
    if (story.kids && story.kids.length > 0) {
      const comments = await fetchComments(story.kids, depth);
      return { ...enhancedStory, comments };
    }
    
    return { ...enhancedStory, comments: [] };
  } catch (error) {
    console.error(`Error fetching story ${id} with comments:`, error);
    return null;
  }
};

/**
 * Recursively fetch comments up to a certain depth
 */
export const fetchComments = async (commentIds: number[], depth: number = 2, currentDepth: number = 0): Promise<Comment[]> => {
  if (currentDepth >= depth || !commentIds || commentIds.length === 0) {
    return [];
  }
  
  try {
    const commentsPromises = commentIds.map(id => fetchItem(id));
    const comments = await Promise.all(commentsPromises);
    
    // Filter out deleted or null comments
    const validComments = comments.filter(comment => comment !== null && !comment.deleted);
    
    // Process each comment and its replies
    const enhancedComments = await Promise.all(
      validComments.map(async comment => {
        // Enhanced comment with timeAgo
        const enhancedComment = {
          ...comment,
          timeAgo: timeAgo(comment.time),
          children: []
        };
        
        // Recursively fetch child comments if we haven't reached max depth
        if (comment.kids && comment.kids.length > 0 && currentDepth < depth - 1) {
          enhancedComment.children = await fetchComments(comment.kids, depth, currentDepth + 1);
        }
        
        return enhancedComment;
      })
    );
    
    return enhancedComments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};