import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateStory(craftType: string, focus: string): Promise<{ title: string; content: string }> {
    try {
        const prompt = `Create a compelling narrative story for a ${craftType} artisan. 
        
        Focus area: ${focus}
        
        Generate a story that:
        - Highlights the cultural heritage and traditional techniques
        - Shows the artisan's passion and dedication
        - Appeals to customers who value authentic craftsmanship
        - Is engaging and emotionally resonant
        - Is 2-3 paragraphs long
        
        Respond with JSON in this format:
        {
            "title": "An engaging title for the story",
            "content": "The complete story content"
        }`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                    },
                    required: ["title", "content"],
                },
            },
            contents: prompt,
        });

        const rawJson = response.text;
        if (rawJson) {
            const data = JSON.parse(rawJson);
            return { title: data.title, content: data.content };
        } else {
            throw new Error("Empty response from model");
        }
    } catch (error) {
        console.error("Story generation error:", error);
        throw new Error(`Failed to generate story: ${error}`);
    }
}

export async function analyzeImage(imagePath: string): Promise<{ description: string; marketingCopy: string }> {
    try {
        const imageBytes = fs.readFileSync(imagePath);

        const contents = [
            {
                inlineData: {
                    data: imageBytes.toString("base64"),
                    mimeType: "image/jpeg",
                },
            },
            `Analyze this artisan product image and generate:
            1. A detailed description of the item, its craftsmanship, and visual appeal
            2. Compelling marketing copy that would attract customers to purchase this handmade item
            
            Focus on:
            - The quality and uniqueness of the craftsmanship
            - Materials and techniques visible in the image
            - Emotional appeal and storytelling elements
            - Value proposition for potential buyers
            
            Respond with JSON in this format:
            {
                "description": "Detailed description of the item and its craftsmanship",
                "marketingCopy": "Compelling marketing copy for selling this item"
            }`,
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        description: { type: "string" },
                        marketingCopy: { type: "string" },
                    },
                    required: ["description", "marketingCopy"],
                },
            },
            contents: contents,
        });

        const rawJson = response.text;
        if (rawJson) {
            const data = JSON.parse(rawJson);
            return { description: data.description, marketingCopy: data.marketingCopy };
        } else {
            throw new Error("Empty response from model");
        }
    } catch (error) {
        console.error("Image analysis error:", error);
        throw new Error(`Failed to analyze image: ${error}`);
    }
}

export async function optimizeSocialContent(platform: string, content: string, craftType: string): Promise<{ optimizedContent: string; hashtags: string[]; caption: string }> {
    try {
        const prompt = `Optimize this social media content for ${platform}:
        
        Content: ${content}
        Craft Type: ${craftType}
        
        Create optimized content that:
        - Is tailored for ${platform}'s audience and format
        - Includes relevant hashtags for maximum reach
        - Has an engaging caption that drives engagement
        - Appeals to people interested in handmade/artisan products
        - Follows ${platform} best practices
        
        Respond with JSON in this format:
        {
            "optimizedContent": "The optimized content",
            "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
            "caption": "An engaging caption for the post"
        }`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        optimizedContent: { type: "string" },
                        hashtags: { 
                            type: "array",
                            items: { type: "string" }
                        },
                        caption: { type: "string" },
                    },
                    required: ["optimizedContent", "hashtags", "caption"],
                },
            },
            contents: prompt,
        });

        const rawJson = response.text;
        if (rawJson) {
            const data = JSON.parse(rawJson);
            return { 
                optimizedContent: data.optimizedContent, 
                hashtags: data.hashtags, 
                caption: data.caption 
            };
        } else {
            throw new Error("Empty response from model");
        }
    } catch (error) {
        console.error("Social content optimization error:", error);
        throw new Error(`Failed to optimize social content: ${error}`);
    }
}

export async function optimizeProductListing(productName: string, platform: string, description: string): Promise<{ optimizedTitle: string; optimizedDescription: string; keywords: string[] }> {
    try {
        const prompt = `Optimize this product listing for ${platform}:
        
        Product Name: ${productName}
        Description: ${description}
        Platform: ${platform}
        
        Create an optimized listing that:
        - Has an SEO-friendly title that will rank well on ${platform}
        - Includes relevant keywords for search visibility
        - Appeals to customers looking for handmade/artisan products
        - Follows ${platform}'s listing best practices
        - Highlights the unique value and craftsmanship
        
        Respond with JSON in this format:
        {
            "optimizedTitle": "SEO-optimized product title",
            "optimizedDescription": "Compelling product description",
            "keywords": ["keyword1", "keyword2", "keyword3"]
        }`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        optimizedTitle: { type: "string" },
                        optimizedDescription: { type: "string" },
                        keywords: { 
                            type: "array",
                            items: { type: "string" }
                        },
                    },
                    required: ["optimizedTitle", "optimizedDescription", "keywords"],
                },
            },
            contents: prompt,
        });

        const rawJson = response.text;
        if (rawJson) {
            const data = JSON.parse(rawJson);
            return { 
                optimizedTitle: data.optimizedTitle, 
                optimizedDescription: data.optimizedDescription, 
                keywords: data.keywords 
            };
        } else {
            throw new Error("Empty response from model");
        }
    } catch (error) {
        console.error("Product listing optimization error:", error);
        throw new Error(`Failed to optimize product listing: ${error}`);
    }
}

export async function generateHeritageStory(technique: string, culturalContext: string): Promise<string> {
    try {
        const prompt = `Create a detailed heritage story about this traditional craft technique:
        
        Technique/Tradition: ${technique}
        Cultural Context: ${culturalContext}
        
        Generate a story that:
        - Explains the historical significance and origins
        - Describes the traditional techniques and methods
        - Highlights the cultural importance and meaning
        - Shows how this tradition is being preserved today
        - Is educational yet engaging for modern audiences
        - Is 2-3 paragraphs long
        
        Focus on authenticity and respect for the cultural heritage.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        return response.text || "Unable to generate heritage story at this time.";
    } catch (error) {
        console.error("Heritage story generation error:", error);
        throw new Error(`Failed to generate heritage story: ${error}`);
    }
}

export async function generateArtistStatement(artistJourney: string, inspiration?: string, philosophy?: string): Promise<string> {
    try {
        const prompt = `Create a professional artist statement based on this information:
        
        Artist Journey: ${artistJourney}
        ${inspiration ? `Inspiration: ${inspiration}` : ''}
        ${philosophy ? `Philosophy: ${philosophy}` : ''}
        
        Generate an artist statement that:
        - Is professional and compelling
        - Reflects the artist's unique voice and perspective
        - Explains their artistic process and approach
        - Connects their personal journey to their craft
        - Appeals to collectors, galleries, and art enthusiasts
        - Is concise but meaningful (2-3 paragraphs)
        
        The statement should be suitable for portfolios, exhibitions, and professional presentations.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        return response.text || "Unable to generate artist statement at this time.";
    } catch (error) {
        console.error("Artist statement generation error:", error);
        throw new Error(`Failed to generate artist statement: ${error}`);
    }
}

export async function analyzeMarketTrends(craftType: string): Promise<{ demandIncrease: number; avgPrice: number; keywords: string[] }> {
    try {
        const prompt = `Analyze current market trends for ${craftType} products:
        
        Provide insights on:
        - Current demand trends and growth patterns
        - Average pricing for handmade ${craftType} items
        - Trending keywords and search terms
        - Market opportunities for artisans
        
        Base your analysis on general market knowledge and trends in the handmade/artisan marketplace.
        
        Respond with JSON in this format:
        {
            "demandIncrease": 25,
            "avgPrice": 45,
            "keywords": ["sustainable", "handmade", "artisan"]
        }`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        demandIncrease: { type: "number" },
                        avgPrice: { type: "number" },
                        keywords: { 
                            type: "array",
                            items: { type: "string" }
                        },
                    },
                    required: ["demandIncrease", "avgPrice", "keywords"],
                },
            },
            contents: prompt,
        });

        const rawJson = response.text;
        if (rawJson) {
            const data = JSON.parse(rawJson);
            return { 
                demandIncrease: data.demandIncrease, 
                avgPrice: data.avgPrice, 
                keywords: data.keywords 
            };
        } else {
            throw new Error("Empty response from model");
        }
    } catch (error) {
        console.error("Market trends analysis error:", error);
        // Return default values if AI fails
        return {
            demandIncrease: 28,
            avgPrice: 45,
            keywords: ["sustainable", "handmade", "eco-friendly"]
        };
    }
}
