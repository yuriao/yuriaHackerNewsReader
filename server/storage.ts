import { 
  users, userComments, storyUpvotes, commentUpvotes,
  type User, type InsertUser,
  type UserComment, type InsertUserComment,
  type StoryUpvote, type InsertStoryUpvote,
  type CommentUpvote, type InsertCommentUpvote
} from "@shared/schema";

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Comment methods
  createComment(comment: InsertUserComment): Promise<UserComment>;
  getCommentsByStoryId(storyId: number): Promise<UserComment[]>;
  getCommentById(id: number): Promise<UserComment | undefined>;
  
  // Upvote methods
  upvoteStory(upvote: InsertStoryUpvote): Promise<StoryUpvote>;
  removeStoryUpvote(userId: number, storyId: number): Promise<boolean>;
  getStoryUpvotes(storyId: number): Promise<number>;
  hasUserUpvotedStory(userId: number, storyId: number): Promise<boolean>;
  
  // Comment upvote methods
  upvoteComment(upvote: InsertCommentUpvote): Promise<CommentUpvote>;
  removeCommentUpvote(userId: number, commentId: number): Promise<boolean>;
  getCommentUpvotes(commentId: number): Promise<number>;
  hasUserUpvotedComment(userId: number, commentId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private comments: Map<number, UserComment>;
  private storyUpvotes: Map<number, StoryUpvote>;
  private commentUpvotes: Map<number, CommentUpvote>;
  
  private userIdCounter: number = 1;
  private commentIdCounter: number = 1;
  private storyUpvoteIdCounter: number = 1;
  private commentUpvoteIdCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.comments = new Map();
    this.storyUpvotes = new Map();
    this.commentUpvotes = new Map();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    // Set the createdAt field as it's required
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // Comment methods
  async createComment(comment: InsertUserComment): Promise<UserComment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    // Ensure parentId is always a number or null, never undefined
    const newComment: UserComment = { 
      ...comment, 
      id, 
      createdAt: now,
      parentId: comment.parentId || null 
    };
    this.comments.set(id, newComment);
    return newComment;
  }
  
  async getCommentsByStoryId(storyId: number): Promise<UserComment[]> {
    return Array.from(this.comments.values()).filter(
      comment => comment.storyId === storyId
    );
  }
  
  async getCommentById(id: number): Promise<UserComment | undefined> {
    return this.comments.get(id);
  }
  
  // Story upvote methods
  async upvoteStory(upvote: InsertStoryUpvote): Promise<StoryUpvote> {
    // Check if user already upvoted this story
    const hasUpvoted = await this.hasUserUpvotedStory(upvote.userId, upvote.storyId);
    if (hasUpvoted) {
      throw new Error("User has already upvoted this story");
    }
    
    const id = this.storyUpvoteIdCounter++;
    const now = new Date();
    const newUpvote: StoryUpvote = { ...upvote, id, createdAt: now };
    this.storyUpvotes.set(id, newUpvote);
    return newUpvote;
  }
  
  async removeStoryUpvote(userId: number, storyId: number): Promise<boolean> {
    const upvoteToRemove = Array.from(this.storyUpvotes.entries()).find(
      ([_, upvote]) => upvote.userId === userId && upvote.storyId === storyId
    );
    
    if (!upvoteToRemove) {
      return false;
    }
    
    this.storyUpvotes.delete(upvoteToRemove[0]);
    return true;
  }
  
  async getStoryUpvotes(storyId: number): Promise<number> {
    return Array.from(this.storyUpvotes.values()).filter(
      upvote => upvote.storyId === storyId
    ).length;
  }
  
  async hasUserUpvotedStory(userId: number, storyId: number): Promise<boolean> {
    return Array.from(this.storyUpvotes.values()).some(
      upvote => upvote.userId === userId && upvote.storyId === storyId
    );
  }
  
  // Comment upvote methods
  async upvoteComment(upvote: InsertCommentUpvote): Promise<CommentUpvote> {
    // Check if user already upvoted this comment
    const hasUpvoted = await this.hasUserUpvotedComment(upvote.userId, upvote.commentId);
    if (hasUpvoted) {
      throw new Error("User has already upvoted this comment");
    }
    
    const id = this.commentUpvoteIdCounter++;
    const now = new Date();
    const newUpvote: CommentUpvote = { ...upvote, id, createdAt: now };
    this.commentUpvotes.set(id, newUpvote);
    return newUpvote;
  }
  
  async removeCommentUpvote(userId: number, commentId: number): Promise<boolean> {
    const upvoteToRemove = Array.from(this.commentUpvotes.entries()).find(
      ([_, upvote]) => upvote.userId === userId && upvote.commentId === commentId
    );
    
    if (!upvoteToRemove) {
      return false;
    }
    
    this.commentUpvotes.delete(upvoteToRemove[0]);
    return true;
  }
  
  async getCommentUpvotes(commentId: number): Promise<number> {
    return Array.from(this.commentUpvotes.values()).filter(
      upvote => upvote.commentId === commentId
    ).length;
  }
  
  async hasUserUpvotedComment(userId: number, commentId: number): Promise<boolean> {
    return Array.from(this.commentUpvotes.values()).some(
      upvote => upvote.userId === userId && upvote.commentId === commentId
    );
  }
}

export const storage = new MemStorage();
