import { 
  type User, type InsertUser,
  type Story, type InsertStory,
  type ImageAnalysis, type InsertImageAnalysis,
  type SocialPost, type InsertSocialPost,
  type ProductListing, type InsertProductListing,
  type HeritageStory, type InsertHeritageStory,
  type Portfolio, type InsertPortfolio,
  type Analytics, type InsertAnalytics
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Story operations
  createStory(story: InsertStory): Promise<Story>;
  getStoriesByUser(userId: string): Promise<Story[]>;
  getStory(id: string): Promise<Story | undefined>;

  // Image analysis operations
  createImageAnalysis(analysis: InsertImageAnalysis): Promise<ImageAnalysis>;
  getImageAnalysesByUser(userId: string): Promise<ImageAnalysis[]>;

  // Social post operations
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  getSocialPostsByUser(userId: string): Promise<SocialPost[]>;

  // Product listing operations
  createProductListing(listing: InsertProductListing): Promise<ProductListing>;
  getProductListingsByUser(userId: string): Promise<ProductListing[]>;

  // Heritage story operations
  createHeritageStory(story: InsertHeritageStory): Promise<HeritageStory>;
  getHeritageStoriesByUser(userId: string): Promise<HeritageStory[]>;

  // Portfolio operations
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  getPortfoliosByUser(userId: string): Promise<Portfolio[]>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;

  // Analytics operations
  getAnalytics(userId: string): Promise<Analytics | undefined>;
  updateAnalytics(userId: string, updates: Partial<InsertAnalytics>): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private stories: Map<string, Story> = new Map();
  private imageAnalyses: Map<string, ImageAnalysis> = new Map();
  private socialPosts: Map<string, SocialPost> = new Map();
  private productListings: Map<string, ProductListing> = new Map();
  private heritageStories: Map<string, HeritageStory> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private analytics: Map<string, Analytics> = new Map();

  constructor() {
    // Create a default user for demo
    const defaultUser: User = {
      id: "demo-user-1",
      username: "maria",
      name: "Maria",
      craftType: "Pottery",
      email: "maria@craftai.com",
      profileImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default analytics
    const defaultAnalytics: Analytics = {
      id: randomUUID(),
      userId: defaultUser.id,
      storiesGenerated: 24,
      imagesAnalyzed: 156,
      socialPosts: 48,
      revenueGrowth: 34,
      updatedAt: new Date(),
    };
    this.analytics.set(defaultUser.id, defaultAnalytics);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      profileImage: insertUser.profileImage || null,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    
    // Initialize analytics for new user
    const analytics: Analytics = {
      id: randomUUID(),
      userId: id,
      storiesGenerated: 0,
      imagesAnalyzed: 0,
      socialPosts: 0,
      revenueGrowth: 0,
      updatedAt: new Date(),
    };
    this.analytics.set(id, analytics);
    
    return user;
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = randomUUID();
    const story: Story = {
      ...insertStory,
      focus: insertStory.focus || null,
      id,
      createdAt: new Date()
    };
    this.stories.set(id, story);
    
    // Update analytics
    const analytics = this.analytics.get(insertStory.userId);
    if (analytics && analytics.storiesGenerated !== null) {
      analytics.storiesGenerated += 1;
      analytics.updatedAt = new Date();
    }
    
    return story;
  }

  async getStoriesByUser(userId: string): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => story.userId === userId);
  }

  async getStory(id: string): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async createImageAnalysis(insertAnalysis: InsertImageAnalysis): Promise<ImageAnalysis> {
    const id = randomUUID();
    const analysis: ImageAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date()
    };
    this.imageAnalyses.set(id, analysis);
    
    // Update analytics
    const analytics = this.analytics.get(insertAnalysis.userId);
    if (analytics && analytics.imagesAnalyzed !== null) {
      analytics.imagesAnalyzed += 1;
      analytics.updatedAt = new Date();
    }
    
    return analysis;
  }

  async getImageAnalysesByUser(userId: string): Promise<ImageAnalysis[]> {
    return Array.from(this.imageAnalyses.values()).filter(analysis => analysis.userId === userId);
  }

  async createSocialPost(insertPost: InsertSocialPost): Promise<SocialPost> {
    const id = randomUUID();
    const post: SocialPost = {
      ...insertPost,
      hashtags: [...(insertPost.hashtags ?? [])] as string[],
      id,
      createdAt: new Date()
    };
    this.socialPosts.set(id, post);
    
    // Update analytics
    const analytics = this.analytics.get(insertPost.userId);
    if (analytics && analytics.socialPosts !== null) {
      analytics.socialPosts += 1;
      analytics.updatedAt = new Date();
    }
    
    return post;
  }

  async getSocialPostsByUser(userId: string): Promise<SocialPost[]> {
    return Array.from(this.socialPosts.values()).filter(post => post.userId === userId);
  }

  async createProductListing(insertListing: InsertProductListing): Promise<ProductListing> {
    const id = randomUUID();
    const listing: ProductListing = {
      ...insertListing,
      keywords: [...(insertListing.keywords ?? [])] as string[],
      id,
      createdAt: new Date()
    };
    this.productListings.set(id, listing);
    return listing;
  }

  async getProductListingsByUser(userId: string): Promise<ProductListing[]> {
    return Array.from(this.productListings.values()).filter(listing => listing.userId === userId);
  }

  async createHeritageStory(insertStory: InsertHeritageStory): Promise<HeritageStory> {
    const id = randomUUID();
    const story: HeritageStory = {
      ...insertStory,
      id,
      createdAt: new Date()
    };
    this.heritageStories.set(id, story);
    return story;
  }

  async getHeritageStoriesByUser(userId: string): Promise<HeritageStory[]> {
    return Array.from(this.heritageStories.values()).filter(story => story.userId === userId);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = {
      ...insertPortfolio,
      tags: [...(insertPortfolio.tags ?? [])] as string[],
      isPublic: insertPortfolio.isPublic ?? false,
      id,
      createdAt: new Date()
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async getPortfoliosByUser(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values()).filter(portfolio => portfolio.userId === userId);
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async getAnalytics(userId: string): Promise<Analytics | undefined> {
    return this.analytics.get(userId);
  }

  async updateAnalytics(userId: string, updates: Partial<InsertAnalytics>): Promise<Analytics> {
    const existing = this.analytics.get(userId);
    if (!existing) {
      const newAnalytics: Analytics = {
        id: randomUUID(),
        userId,
        storiesGenerated: 0,
        imagesAnalyzed: 0,
        socialPosts: 0,
        revenueGrowth: 0,
        ...updates,
        updatedAt: new Date(),
      };
      this.analytics.set(userId, newAnalytics);
      return newAnalytics;
    }

    const updated: Analytics = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.analytics.set(userId, updated);
    return updated;
  }
}

export const storage = new MemStorage();
