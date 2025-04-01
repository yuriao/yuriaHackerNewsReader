/**
 * Shared type definitions for both web and mobile apps
 */

// Basic Hacker News item types
export interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  descendants: number; // comment count
  by: string;
  time: number;
  type: string;
  kids?: number[]; // comment ids
  text?: string;
}

export interface Comment {
  id: number;
  text: string;
  by: string;
  time: number;
  kids?: number[];
  parent: number;
}

export interface User {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

// Story category types
export type StoryType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

// Enhanced types with additional UI properties
export interface StoryWithDetails extends Story {
  domain?: string;
  timeAgo?: string;
}

export interface CommentWithDetails extends Comment {
  timeAgo?: string;
  children?: CommentWithDetails[];
}

// Topic visualization data types
export interface TopicData {
  name: string;
  children: Array<{
    name: string;
    value: number;
  }>;
}

export interface TopicHistoryItem {
  date: string; // ISO date string for the day
  topics: {
    [topicName: string]: number; // Topic name -> count mapping
  };
}

export interface TopicTrendData {
  dates: string[];
  topics: string[];
  data: number[][];
}