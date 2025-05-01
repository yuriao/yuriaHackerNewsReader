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

export type StoryType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export interface StoryWithDetails extends Story {
  domain?: string;
  timeAgo?: string;
}

export interface CommentWithDetails extends Comment {
  timeAgo?: string;
  children?: CommentWithDetails[];
}
