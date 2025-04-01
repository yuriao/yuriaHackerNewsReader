import { pgTable, text, serial, integer, boolean, timestamp, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// User comments on stories
export const userComments = pgTable("user_comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  storyId: integer("story_id").notNull(),
  text: text("text").notNull(),
  parentId: integer("parent_id"), // For nested comments
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserCommentSchema = createInsertSchema(userComments).pick({
  userId: true,
  storyId: true,
  text: true,
  parentId: true,
});

// Story upvotes by users
export const storyUpvotes = pgTable("story_upvotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  storyId: integer("story_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userStoryIndex: uniqueIndex("user_story_idx").on(table.userId, table.storyId),
  }
});

export const insertStoryUpvoteSchema = createInsertSchema(storyUpvotes).pick({
  userId: true,
  storyId: true,
});

// Comment upvotes by users
export const commentUpvotes = pgTable("comment_upvotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  commentId: integer("comment_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userCommentIndex: uniqueIndex("user_comment_idx").on(table.userId, table.commentId),
  }
});

export const insertCommentUpvoteSchema = createInsertSchema(commentUpvotes).pick({
  userId: true,
  commentId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserComment = z.infer<typeof insertUserCommentSchema>;
export type UserComment = typeof userComments.$inferSelect;
export type InsertStoryUpvote = z.infer<typeof insertStoryUpvoteSchema>;
export type StoryUpvote = typeof storyUpvotes.$inferSelect;
export type InsertCommentUpvote = z.infer<typeof insertCommentUpvoteSchema>;
export type CommentUpvote = typeof commentUpvotes.$inferSelect;
