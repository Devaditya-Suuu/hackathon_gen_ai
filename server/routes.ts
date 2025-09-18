import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertStorySchema,
  insertImageAnalysisSchema,
  insertSocialPostSchema,
  insertProductListingSchema,
  insertHeritageStorySchema,
  insertPortfolioSchema
} from "@shared/schema";
import { 
  generateStory, 
  analyzeImage, 
  optimizeSocialContent, 
  optimizeProductListing, 
  generateHeritageStory, 
  generateArtistStatement,
  analyzeMarketTrends 
} from "./services/gemini";
import multer from "multer";
import path from "path";
import fs from "fs";

// Extend Request type for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (simplified for demo)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser("demo-user-1");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics("demo-user-1");
      if (!analytics) {
        return res.status(404).json({ message: "Analytics not found" });
      }
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });

  // Generate story
  app.post("/api/stories/generate", async (req, res) => {
    try {
      const { craftType, focus } = req.body;
      
      if (!craftType || !focus) {
        return res.status(400).json({ message: "Craft type and focus are required" });
      }

      const { title, content } = await generateStory(craftType, focus);
      
      const story = await storage.createStory({
        userId: "demo-user-1",
        title,
        content,
        craftType,
        focus
      });

      res.json(story);
    } catch (error: any) {
      console.error("Story generation error:", error);
      if (error?.status === 400 && /API key not valid/i.test(error?.message || "")) {
        return res.status(401).json({ message: "Invalid Gemini API key. Update GEMINI_API_KEY and restart the server." });
      }
      
      // Check if it's a Gemini API overload error
      if (error.message && (error.message.includes('overloaded') || error.message.includes('503'))) {
        return res.status(503).json({ 
          message: "AI service is temporarily overloaded. Please try again in a moment.",
          retryAfter: 30
        });
      }
      
      res.status(500).json({ 
        message: "Failed to generate story. Please try again later." 
      });
    }
  });

  // Get user stories
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getStoriesByUser("demo-user-1");
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stories" });
    }
  });

  // Analyze image
  app.post("/api/images/analyze", upload.single('image'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imagePath = req.file.path;
      const { description, marketingCopy } = await analyzeImage(imagePath);
      
      const analysis = await storage.createImageAnalysis({
        userId: "demo-user-1",
        imageUrl: `uploads/${req.file.filename}`,
        description,
        marketingCopy
      });

      // Clean up uploaded file
      fs.unlinkSync(imagePath);

      res.json(analysis);
    } catch (error: any) {
      console.error("Image analysis error:", error);
      if (error?.status === 400 && /API key not valid/i.test(error?.message || "")) {
        return res.status(401).json({ message: "Invalid Gemini API key. Update GEMINI_API_KEY and restart the server." });
      }
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      // Check if it's a Gemini API overload error
      if (error.message && (error.message.includes('overloaded') || error.message.includes('503'))) {
        return res.status(503).json({ 
          message: "AI service is temporarily overloaded. Please try again in a moment.",
          retryAfter: 30
        });
      }
      
      res.status(500).json({ 
        message: "Failed to analyze image. Please try again later." 
      });
    }
  });

  // Get image analyses
  app.get("/api/images", async (req, res) => {
    try {
      const analyses = await storage.getImageAnalysesByUser("demo-user-1");
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get image analyses" });
    }
  });

  // Optimize social content
  app.post("/api/social/optimize", async (req, res) => {
    try {
      const { platform, content, craftType } = req.body;
      
      if (!platform || !content || !craftType) {
        return res.status(400).json({ message: "Platform, content, and craft type are required" });
      }

      const { optimizedContent, hashtags, caption } = await optimizeSocialContent(platform, content, craftType);
      
      const post = await storage.createSocialPost({
        userId: "demo-user-1",
        platform,
        content: optimizedContent,
        hashtags,
        caption
      });

      res.json(post);
    } catch (error: any) {
      console.error("Social optimization error:", error);
      if (error?.status === 400 && /API key not valid/i.test(error?.message || "")) {
        return res.status(401).json({ message: "Invalid Gemini API key. Update GEMINI_API_KEY and restart the server." });
      }
      res.status(500).json({ message: "Failed to optimize social content" });
    }
  });

  // Get social posts
  app.get("/api/social", async (req, res) => {
    try {
      const posts = await storage.getSocialPostsByUser("demo-user-1");
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get social posts" });
    }
  });

  // Optimize product listing
  app.post("/api/products/optimize", async (req, res) => {
    try {
      const { productName, platform, description } = req.body;
      
      if (!productName || !platform) {
        return res.status(400).json({ message: "Product name and platform are required" });
      }

      const { optimizedTitle, optimizedDescription, keywords } = await optimizeProductListing(productName, platform, description || "");
      
      const listing = await storage.createProductListing({
        userId: "demo-user-1",
        productName,
        platform,
        optimizedTitle,
        description: optimizedDescription,
        keywords
      });

      res.json(listing);
    } catch (error: any) {
      console.error("Product optimization error:", error);
      if (error?.status === 400 && /API key not valid/i.test(error?.message || "")) {
        return res.status(401).json({ message: "Invalid Gemini API key. Update GEMINI_API_KEY and restart the server." });
      }
      res.status(500).json({ message: "Failed to optimize product listing" });
    }
  });

  // Get product listings
  app.get("/api/products", async (req, res) => {
    try {
      const listings = await storage.getProductListingsByUser("demo-user-1");
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get product listings" });
    }
  });

  // Generate heritage story
  app.post("/api/heritage/generate", async (req, res) => {
    try {
      const { technique, culturalContext } = req.body;
      
      if (!technique || !culturalContext) {
        return res.status(400).json({ message: "Technique and cultural context are required" });
      }

      const story = await generateHeritageStory(technique, culturalContext);
      
      const heritageStory = await storage.createHeritageStory({
        userId: "demo-user-1",
        technique,
        culturalContext,
        story
      });

      res.json(heritageStory);
    } catch (error) {
      console.error("Heritage story generation error:", error);
      res.status(500).json({ message: "Failed to generate heritage story" });
    }
  });

  // Get heritage stories
  app.get("/api/heritage", async (req, res) => {
    try {
      const stories = await storage.getHeritageStoriesByUser("demo-user-1");
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get heritage stories" });
    }
  });

  // Generate artist statement
  app.post("/api/portfolio/generate-statement", async (req, res) => {
    try {
      const { artistJourney, inspiration, philosophy } = req.body;
      
      if (!artistJourney) {
        return res.status(400).json({ message: "Artist journey is required" });
      }

      const statement = await generateArtistStatement(artistJourney, inspiration, philosophy);
      
      res.json({ statement });
    } catch (error) {
      console.error("Artist statement generation error:", error);
      res.status(500).json({ message: "Failed to generate artist statement" });
    }
  });

  // Create portfolio
  app.post("/api/portfolio", async (req, res) => {
    try {
      const { title, artistStatement, description, tags } = req.body;
      
      if (!title || !artistStatement || !description) {
        return res.status(400).json({ message: "Title, artist statement, and description are required" });
      }

      const portfolio = await storage.createPortfolio({
        userId: "demo-user-1",
        title,
        artistStatement,
        description,
        tags: tags || [],
        isPublic: false
      });

      res.json(portfolio);
    } catch (error) {
      console.error("Portfolio creation error:", error);
      res.status(500).json({ message: "Failed to create portfolio" });
    }
  });

  // Get portfolios
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolios = await storage.getPortfoliosByUser("demo-user-1");
      res.json(portfolios);
    } catch (error) {
      res.status(500).json({ message: "Failed to get portfolios" });
    }
  });

  // Get market trends
  app.get("/api/market-trends", async (req, res) => {
    try {
      const { craftType } = req.query;
      const trends = await analyzeMarketTrends(craftType as string || "Pottery");
      res.json(trends);
    } catch (error) {
      console.error("Market trends error:", error);
      res.status(500).json({ message: "Failed to analyze market trends" });
    }
  });

  // Get recent activity (last 10 items across all types)
  app.get("/api/activity", async (req, res) => {
    try {
      const [stories, images, social, heritage] = await Promise.all([
        storage.getStoriesByUser("demo-user-1"),
        storage.getImageAnalysesByUser("demo-user-1"),
        storage.getSocialPostsByUser("demo-user-1"),
        storage.getHeritageStoriesByUser("demo-user-1")
      ]);

      const activities = [
        ...stories.map(s => ({ type: 'story', title: `Generated story for ${s.craftType}`, createdAt: s.createdAt })),
        ...images.map(i => ({ type: 'image', title: 'Analyzed product image', createdAt: i.createdAt })),
        ...social.map(s => ({ type: 'social', title: `Optimized ${s.platform} content`, createdAt: s.createdAt })),
        ...heritage.map(h => ({ type: 'heritage', title: `Created heritage story for ${h.technique}`, createdAt: h.createdAt }))
      ].sort((a, b) => {
        const timeB = (b.createdAt ? new Date(b.createdAt) : new Date(0)).getTime();
        const timeA = (a.createdAt ? new Date(a.createdAt) : new Date(0)).getTime();
        return timeB - timeA;
      }).slice(0, 10);

      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent activity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
