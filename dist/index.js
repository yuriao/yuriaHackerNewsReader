// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/api/hackerNews.ts
import axios from "axios";

// client/src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function timeAgo(timestamp2) {
  const seconds = Math.floor(Date.now() / 1e3 - timestamp2);
  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo ago`;
  }
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
function extractDomain(url) {
  if (!url) return "";
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch (e) {
    return "";
  }
}

// server/api/hackerNews.ts
var API_BASE_URL = "https://hacker-news.firebaseio.com/v0";
var CACHE_TTL = 5 * 60 * 1e3;
var cache = {};
var fetchWithCache = async (url) => {
  const now = Date.now();
  if (cache[url] && now - cache[url].timestamp < CACHE_TTL) {
    return cache[url].data;
  }
  try {
    const response = await axios.get(url);
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
var getStoryIds = async (storyType) => {
  const validTypes = ["top", "new", "best", "ask", "show", "job"];
  if (!validTypes.includes(storyType)) {
    throw new Error(`Invalid story type: ${storyType}`);
  }
  return fetchWithCache(`${API_BASE_URL}/${storyType}stories.json`);
};
var getItem = async (id) => {
  return fetchWithCache(`${API_BASE_URL}/item/${id}.json`);
};
var getStory = async (id) => {
  const story = await getItem(id);
  if (!story) return null;
  return {
    ...story,
    timeAgo: timeAgo(story.time),
    domain: story.url ? extractDomain(story.url) : void 0
  };
};
var getStories = async (storyType, limit = 30) => {
  try {
    const ids = await getStoryIds(storyType);
    const limitedIds = ids.slice(0, limit);
    const stories = await Promise.all(
      limitedIds.map((id) => getStory(id))
    );
    return stories.filter(Boolean);
  } catch (error) {
    console.error(`Error fetching ${storyType} stories:`, error);
    throw error;
  }
};
var getComments = async (storyId) => {
  try {
    const story = await getStory(storyId);
    if (!story || !story.kids || story.kids.length === 0) {
      return [];
    }
    const commentsPromises = story.kids.map(async (commentId) => {
      const comment = await getItem(commentId);
      if (!comment) return null;
      return {
        ...comment,
        timeAgo: timeAgo(comment.time),
        children: []
      };
    });
    const comments = await Promise.all(commentsPromises);
    return comments.filter(Boolean);
  } catch (error) {
    console.error(`Error fetching comments for story ${storyId}:`, error);
    throw error;
  }
};
var getCommentWithReplies = async (commentId, depth = 2) => {
  if (depth <= 0) return null;
  try {
    const comment = await getItem(commentId);
    if (!comment) return null;
    const enrichedComment = {
      ...comment,
      timeAgo: timeAgo(comment.time),
      children: []
    };
    if (comment.kids && comment.kids.length > 0 && depth > 1) {
      const childrenPromises = comment.kids.map(
        (kidId) => getCommentWithReplies(kidId, depth - 1)
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
var getStoryWithComments = async (storyId, commentDepth = 2) => {
  try {
    const story = await getStory(storyId);
    if (!story) return { story: null, comments: [] };
    if (!story.kids || story.kids.length === 0) {
      return { story, comments: [] };
    }
    const commentsPromises = story.kids.map(
      (commentId) => getCommentWithReplies(commentId, commentDepth)
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

// server/controllers/storiesController.ts
var getStoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 30;
    const stories = await getStories(type, limit);
    res.json(stories);
  } catch (error) {
    console.error("Error in getStoriesByType:", error);
    res.status(500).json({ message: "Failed to fetch stories" });
  }
};
var getSingleStory = async (req, res) => {
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
var getStoryComments = async (req, res) => {
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
var getStoryWithCommentsHandler = async (req, res) => {
  try {
    const storyId = parseInt(req.params.id);
    if (isNaN(storyId)) {
      return res.status(400).json({ message: "Invalid story ID" });
    }
    const depth = req.query.depth ? parseInt(req.query.depth) : 2;
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

// server/storage.ts
var MemStorage = class {
  users;
  comments;
  storyUpvotes;
  commentUpvotes;
  userIdCounter = 1;
  commentIdCounter = 1;
  storyUpvoteIdCounter = 1;
  commentUpvoteIdCounter = 1;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.comments = /* @__PURE__ */ new Map();
    this.storyUpvotes = /* @__PURE__ */ new Map();
    this.commentUpvotes = /* @__PURE__ */ new Map();
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const user = {
      ...insertUser,
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  // Comment methods
  async createComment(comment) {
    const id = this.commentIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const newComment = {
      ...comment,
      id,
      createdAt: now,
      parentId: comment.parentId || null
    };
    this.comments.set(id, newComment);
    return newComment;
  }
  async getCommentsByStoryId(storyId) {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.storyId === storyId
    );
  }
  async getCommentById(id) {
    return this.comments.get(id);
  }
  // Story upvote methods
  async upvoteStory(upvote) {
    const hasUpvoted = await this.hasUserUpvotedStory(upvote.userId, upvote.storyId);
    if (hasUpvoted) {
      throw new Error("User has already upvoted this story");
    }
    const id = this.storyUpvoteIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const newUpvote = { ...upvote, id, createdAt: now };
    this.storyUpvotes.set(id, newUpvote);
    return newUpvote;
  }
  async removeStoryUpvote(userId, storyId) {
    const upvoteToRemove = Array.from(this.storyUpvotes.entries()).find(
      ([_, upvote]) => upvote.userId === userId && upvote.storyId === storyId
    );
    if (!upvoteToRemove) {
      return false;
    }
    this.storyUpvotes.delete(upvoteToRemove[0]);
    return true;
  }
  async getStoryUpvotes(storyId) {
    return Array.from(this.storyUpvotes.values()).filter(
      (upvote) => upvote.storyId === storyId
    ).length;
  }
  async hasUserUpvotedStory(userId, storyId) {
    return Array.from(this.storyUpvotes.values()).some(
      (upvote) => upvote.userId === userId && upvote.storyId === storyId
    );
  }
  // Comment upvote methods
  async upvoteComment(upvote) {
    const hasUpvoted = await this.hasUserUpvotedComment(upvote.userId, upvote.commentId);
    if (hasUpvoted) {
      throw new Error("User has already upvoted this comment");
    }
    const id = this.commentUpvoteIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const newUpvote = { ...upvote, id, createdAt: now };
    this.commentUpvotes.set(id, newUpvote);
    return newUpvote;
  }
  async removeCommentUpvote(userId, commentId) {
    const upvoteToRemove = Array.from(this.commentUpvotes.entries()).find(
      ([_, upvote]) => upvote.userId === userId && upvote.commentId === commentId
    );
    if (!upvoteToRemove) {
      return false;
    }
    this.commentUpvotes.delete(upvoteToRemove[0]);
    return true;
  }
  async getCommentUpvotes(commentId) {
    return Array.from(this.commentUpvotes.values()).filter(
      (upvote) => upvote.commentId === commentId
    ).length;
  }
  async hasUserUpvotedComment(userId, commentId) {
    return Array.from(this.commentUpvotes.values()).some(
      (upvote) => upvote.userId === userId && upvote.commentId === commentId
    );
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var userComments = pgTable("user_comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  storyId: integer("story_id").notNull(),
  text: text("text").notNull(),
  parentId: integer("parent_id"),
  // For nested comments
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserCommentSchema = createInsertSchema(userComments).pick({
  userId: true,
  storyId: true,
  text: true,
  parentId: true
});
var storyUpvotes = pgTable("story_upvotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  storyId: integer("story_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => {
  return {
    userStoryIndex: uniqueIndex("user_story_idx").on(table.userId, table.storyId)
  };
});
var insertStoryUpvoteSchema = createInsertSchema(storyUpvotes).pick({
  userId: true,
  storyId: true
});
var commentUpvotes = pgTable("comment_upvotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  commentId: integer("comment_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => {
  return {
    userCommentIndex: uniqueIndex("user_comment_idx").on(table.userId, table.commentId)
  };
});
var insertCommentUpvoteSchema = createInsertSchema(commentUpvotes).pick({
  userId: true,
  commentId: true
});

// server/controllers/interactionController.ts
import { z } from "zod";
var createComment = async (req, res) => {
  try {
    const validatedData = insertUserCommentSchema.parse(req.body);
    const comment = await storage.createComment(validatedData);
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};
var getCommentsByStoryId = async (req, res) => {
  try {
    const storyId = parseInt(req.params.storyId);
    if (isNaN(storyId)) {
      return res.status(400).json({ error: "Invalid story ID" });
    }
    const comments = await storage.getCommentsByStoryId(storyId);
    res.json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Failed to get comments" });
  }
};
var upvoteStory = async (req, res) => {
  try {
    const validatedData = insertStoryUpvoteSchema.parse(req.body);
    const hasUpvoted = await storage.hasUserUpvotedStory(validatedData.userId, validatedData.storyId);
    if (hasUpvoted) {
      await storage.removeStoryUpvote(validatedData.userId, validatedData.storyId);
      const upvoteCount2 = await storage.getStoryUpvotes(validatedData.storyId);
      return res.json({ upvoted: false, count: upvoteCount2 });
    }
    await storage.upvoteStory(validatedData);
    const upvoteCount = await storage.getStoryUpvotes(validatedData.storyId);
    res.json({ upvoted: true, count: upvoteCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error upvoting story:", error);
    res.status(500).json({ error: "Failed to upvote story" });
  }
};
var getStoryUpvoteCount = async (req, res) => {
  try {
    const storyId = parseInt(req.params.storyId);
    if (isNaN(storyId)) {
      return res.status(400).json({ error: "Invalid story ID" });
    }
    const count = await storage.getStoryUpvotes(storyId);
    res.json({ count });
  } catch (error) {
    console.error("Error getting upvote count:", error);
    res.status(500).json({ error: "Failed to get upvote count" });
  }
};
var hasUserUpvotedStory = async (req, res) => {
  try {
    const storyId = parseInt(req.params.storyId);
    const userId = parseInt(req.params.userId);
    if (isNaN(storyId) || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid story or user ID" });
    }
    const hasUpvoted = await storage.hasUserUpvotedStory(userId, storyId);
    res.json({ hasUpvoted });
  } catch (error) {
    console.error("Error checking if user has upvoted story:", error);
    res.status(500).json({ error: "Failed to check if user has upvoted story" });
  }
};
var upvoteComment = async (req, res) => {
  try {
    const validatedData = insertCommentUpvoteSchema.parse(req.body);
    const hasUpvoted = await storage.hasUserUpvotedComment(validatedData.userId, validatedData.commentId);
    if (hasUpvoted) {
      await storage.removeCommentUpvote(validatedData.userId, validatedData.commentId);
      const upvoteCount2 = await storage.getCommentUpvotes(validatedData.commentId);
      return res.json({ upvoted: false, count: upvoteCount2 });
    }
    await storage.upvoteComment(validatedData);
    const upvoteCount = await storage.getCommentUpvotes(validatedData.commentId);
    res.json({ upvoted: true, count: upvoteCount });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error upvoting comment:", error);
    res.status(500).json({ error: "Failed to upvote comment" });
  }
};
var getCommentUpvoteCount = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }
    const count = await storage.getCommentUpvotes(commentId);
    res.json({ count });
  } catch (error) {
    console.error("Error getting comment upvote count:", error);
    res.status(500).json({ error: "Failed to get comment upvote count" });
  }
};

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/stories/:type", getStoriesByType);
  app2.get("/api/story/:id", getSingleStory);
  app2.get("/api/item/:id/comments", getStoryComments);
  app2.get("/api/item/:id/with-comments", getStoryWithCommentsHandler);
  app2.post("/api/comments", createComment);
  app2.get("/api/story/:storyId/comments", getCommentsByStoryId);
  app2.post("/api/story/upvote", upvoteStory);
  app2.get("/api/story/:storyId/upvotes", getStoryUpvoteCount);
  app2.get("/api/story/:storyId/upvoted/:userId", hasUserUpvotedStory);
  app2.post("/api/comment/upvote", upvoteComment);
  app2.get("/api/comment/:commentId/upvotes", getCommentUpvoteCount);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import cors from "cors";
var app = express2();
app.use(cors());
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
