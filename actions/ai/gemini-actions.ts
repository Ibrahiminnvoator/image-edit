/*
 * Server actions for interacting with Gemini AI models
 */

"use server"

import { genAI, GEMINI_TEXT_MODEL, GEMINI_VISION_MODEL } from "@/lib/gemini"
import { ActionState, ImageMimeType } from "@/types"

/**
 * Describes an image using Gemini Vision model
 * @param base64Image The base64-encoded image data
 * @param mimeType The MIME type of the image
 * @returns A text description of the image
 */
export async function describeImageWithGeminiAction(
  base64Image: string,
  mimeType: string
): Promise<ActionState<{ description: string }>> {
  try {
    // For debugging - log the API key (masked for security)
    const apiKeyMasked = process.env.GEMINI_API_KEY ? 
      `${process.env.GEMINI_API_KEY.substring(0, 4)}...${process.env.GEMINI_API_KEY.substring(process.env.GEMINI_API_KEY.length - 4)}` : 
      'undefined';
    console.log(`Using Gemini API Key (masked): ${apiKeyMasked}`);
    console.log(`Using Gemini Vision Model: ${GEMINI_VISION_MODEL}`);
    
    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: GEMINI_VISION_MODEL
    })

    // Prepare the image data - verify base64 format
    if (!base64Image || base64Image.length < 100) {
      console.error('Invalid base64 image data:', base64Image ? `${base64Image.substring(0, 20)}... (length: ${base64Image.length})` : 'undefined');
      throw new Error('Invalid base64 image data');
    }
    
    console.log(`Base64 image data length: ${base64Image.length}, MIME type: ${mimeType}`);
    
    // Generate a description prompt
    const prompt = "Describe this image in detail. Focus on the main subjects, colors, setting, and any notable elements. Keep it concise but comprehensive."

    // For debugging
    console.log("Attempting to describe image with mimeType:", mimeType)

    let description = "";
    try {
      // Generate content with the image
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: prompt }, { inlineData: { data: base64Image, mimeType } }]
        }]
      })
      
      const response = await result.response
      description = response.text()

      console.log("Generated description:", description.substring(0, 100) + "...")
    } catch (apiError) {
      console.error('Gemini API error details:', apiError);
      throw apiError;
    }

    if (!description) {
      return {
        isSuccess: false,
        message: "لم يتمكن النموذج من وصف الصورة"
      }
    }

    return {
      isSuccess: true,
      message: "تم وصف الصورة بنجاح",
      data: {
        description
      }
    }
  } catch (error) {
    console.error("Error in describeImageWithGeminiAction:", error)
    return {
      isSuccess: false,
      message: "حدث خطأ أثناء وصف الصورة"
    }
  }
}

/**
 * Detects the language of a text and translates it to English if it's Arabic
 * @param text The text to analyze and potentially translate
 * @returns The detected language and translated text (if applicable)
 */
export async function detectLanguageAndTranslateWithGeminiAction(
  text: string
): Promise<ActionState<{ detectedLanguage: string; translatedText: string | null }>> {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: GEMINI_TEXT_MODEL })

    // Generate a language detection prompt
    const detectionPrompt = `Detect the language of the following text and respond with only "ar" for Arabic or "en" for English or other languages: "${text}"`

    // Detect the language
    const detectionResult = await model.generateContent(detectionPrompt)
    const detectionResponse = await detectionResult.response
    const detectedLanguage = detectionResponse.text().trim().toLowerCase()

    // If the language is Arabic, translate it to English
    let translatedText: string | null = null
    if (detectedLanguage === "ar") {
      const translationPrompt = `Translate the following Arabic text to English: "${text}"`
      const translationResult = await model.generateContent(translationPrompt)
      const translationResponse = await translationResult.response
      translatedText = translationResponse.text()
    }

    return {
      isSuccess: true,
      message: "تم تحليل النص بنجاح",
      data: {
        detectedLanguage,
        translatedText
      }
    }
  } catch (error) {
    console.error("Error in detectLanguageAndTranslateWithGeminiAction:", error)
    return {
      isSuccess: false,
      message: "حدث خطأ أثناء تحليل النص"
    }
  }
}

/**
 * Edits an image based on the user prompt and AI-generated description
 * @param base64Image The base64-encoded original image data
 * @param mimeType The MIME type of the image
 * @param aiDescription The AI-generated description of the image
 * @param userPromptForEditing The user prompt for editing (translated to English if originally Arabic)
 * @returns The edited image as a base64 string
 */
export async function editImageWithGeminiAction(
  base64Image: string,
  mimeType: string,
  aiDescription: string,
  userPromptForEditing: string
): Promise<ActionState<{ editedImageBase64: string }>> {
  try {
    // Initialize the model - using the vision model for analysis
    const model = genAI.getGenerativeModel({ model: GEMINI_VISION_MODEL })

    // Prepare the image data
    const imageData = {
      inlineData: {
        data: base64Image,
        mimeType
      }
    }

    // Generate an editing prompt
    const prompt = `
      I have an image that I want to edit. Here's a description of the original image:
      "${aiDescription}"
      
      Please describe in detail how this image should be modified according to these instructions:
      "${userPromptForEditing}"
      
      Be specific about what elements should change and how they should look after editing.
    `

    // Get editing instructions from Gemini
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }, { inlineData: { data: base64Image, mimeType } }]
      }]
    })
    const response = await result.response
    const editingInstructions = response.text()

    // For demo purposes, we're simulating an edited image by returning the original
    // In a production environment, you would use these instructions with an image editing API
    // such as Dall-E, Midjourney, or a custom image processing service
    
    console.log("Editing instructions generated:", editingInstructions)
    
    // For now, we'll just return the original image as the "edited" version
    // This is a temporary solution until a proper image generation API is integrated
    return {
      isSuccess: true,
      message: "تم تعديل الصورة بنجاح (نسخة تجريبية)",
      data: {
        editedImageBase64: base64Image // Return the original image for now
      }
    }
  } catch (error) {
    console.error("Error in editImageWithGeminiAction:", error)
    return {
      isSuccess: false,
      message: "حدث خطأ أثناء تعديل الصورة"
    }
  }
}
