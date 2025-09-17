import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  craftType: text("craft_type").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  craftType: text("craft_type").notNull(),
  focus: text("focus"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const imageAnalyses = pgTable("image_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
  marketingCopy: text("marketing_copy").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(),
  content: text("content").notNull(),
  hashtags: jsonb("hashtags").$type<string[]>().notNull(),
  caption: text("caption").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productListings = pgTable("product_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  productName: text("product_name").notNull(),
  platform: text("platform").notNull(),
  optimizedTitle: text("optimized_title").notNull(),
  description: text("description").notNull(),
  keywords: jsonb("keywords").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const heritageStories = pgTable("heritage_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  technique: text("technique").notNull(),
  culturalContext: text("cultural_context").notNull(),
  story: text("story").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  artistStatement: text("artist_statement").notNull(),
  description: text("description").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  storiesGenerated: integer("stories_generated").default(0),
  imagesAnalyzed: integer("images_analyzed").default(0),
  socialPosts: integer("social_posts").default(0),
  revenueGrowth: integer("revenue_growth").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

export const insertImageAnalysisSchema = createInsertSchema(imageAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
});

export const insertProductListingSchema = createInsertSchema(productListings).omit({
  id: true,
  createdAt: true,
});

export const insertHeritageStorySchema = createInsertSchema(heritageStories).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type ImageAnalysis = typeof imageAnalyses.$inferSelect;
export type InsertImageAnalysis = z.infer<typeof insertImageAnalysisSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type ProductListing = typeof productListings.$inferSelect;
export type InsertProductListing = z.infer<typeof insertProductListingSchema>;
export type HeritageStory = typeof heritageStories.$inferSelect;
export type InsertHeritageStory = z.infer<typeof insertHeritageStorySchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
