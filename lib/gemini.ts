/*
 * Gemini API client setup for AisarEdit
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client with the API key
const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables")
}

export const genAI = new GoogleGenerativeAI(apiKey)

// Models for different tasks
export const GEMINI_VISION_MODEL = "gemini-2.0-flash-preview-image-generation" // For image analysis and generation
export const GEMINI_TEXT_MODEL = "gemini-2.0-flash-preview" // For text translation and processing
