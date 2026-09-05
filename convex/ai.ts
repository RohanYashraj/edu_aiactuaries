"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export const generateContentDetails = action({
  args: { input: v.string() },
  handler: async (ctx, args) => {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in Convex environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "The title of the content or event." },
        subtitle: { type: Type.STRING, description: "A short, catchy subtitle." },
        summary: { type: Type.STRING, description: "A concise summary (around 2-3 sentences) of the content." },
        type: { 
          type: Type.STRING, 
          description: "The type of content.",
          enum: ["event", "workshop", "certification", "program", "internship", "news"] 
        },
        body: { type: Type.STRING, description: "The main body/description of the content, can be formatted in markdown." },
        badge: { type: Type.STRING, description: "A short highlight badge text (e.g., 'New', 'Featured')." },
        startDate: { type: Type.STRING, description: "The start date in YYYY-MM-DD format." },
        endDate: { type: Type.STRING, description: "The end date in YYYY-MM-DD format." },
        dateLabel: { type: Type.STRING, description: "A human-readable date string (e.g., 'October 12-14, 2024')." },
        location: { type: Type.STRING, description: "The physical location or 'Online'." },
        slug: { type: Type.STRING, description: "A URL-friendly slug based on the title." },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of relevant keyword tags." },
        metaTitle: { type: Type.STRING, description: "SEO meta title." },
        metaDescription: { type: Type.STRING, description: "SEO meta description." },
        linkedinUrl: { type: Type.STRING, description: "A relevant LinkedIn URL if mentioned." },
        websiteUrl: { type: Type.STRING, description: "A relevant external website URL." },
        websiteLabel: { type: Type.STRING, description: "Label for the website URL (e.g., 'Official Site')." },
        featured: { type: Type.BOOLEAN, description: "Whether this content should be featured prominently." },
      },
      required: ["title", "summary", "type", "slug"],
    };

    const isUrl = args.input.trim().startsWith("http");
    const tools = isUrl ? [{ googleSearch: {} }] : undefined;
    
    const prompt = `Extract the structured details from the following ${isUrl ? 'URL' : 'text'} to populate our content management system.
    If it's an educational course, it might be a 'program', 'certification', or 'workshop'. If it's a job or placement, it's an 'internship'. If it's a standalone session, it's an 'event'. Otherwise 'news'.
    
    Input:
    ${args.input}`;

    const fallbackModels = [
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.1-pro-preview",
      "gemini-3-flash-preview",
      "gemini-flash-latest",
      "gemini-pro-latest",
      "gemini-2.5-pro",
      "gemini-2.5-flash"
    ];

    let response = null;
    let lastError: any = null;

    for (const modelName of fallbackModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        });
        
        // If it succeeds, break out of the loop
        if (response?.text) {
          break;
        }
      } catch (error) {
        console.warn(`Model ${modelName} failed. Trying next...`, error);
        lastError = error;
      }
    }

    if (!response || !response.text) {
      const errorMessage = lastError?.message || lastError?.toString() || "Unknown API Error";
      throw new Error(`All fallback models failed. Last error: ${errorMessage}`);
    }

    try {
      const parsed = JSON.parse(response.text);
      return parsed;
    } catch (e) {
      throw new Error("Failed to parse AI response as JSON.");
    }
  },
});
