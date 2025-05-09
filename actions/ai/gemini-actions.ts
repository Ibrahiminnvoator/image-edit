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
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: GEMINI_VISION_MODEL })

    // Prepare the image data
    const imageData = {
      inlineData: {
        data: base64Image,
        mimeType
      }
    }

    // Generate a description prompt
    const prompt = "Describe this image in detail. Focus on the main subjects, colors, setting, and any notable elements. Keep it concise but comprehensive."

    // Generate content with the image
    const result = await model.generateContent([prompt, imageData])
    const response = await result.response
    const description = response.text()

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
    // Initialize the model
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
      
      Please edit this image according to the following instructions:
      "${userPromptForEditing}"
      
      Generate a new version of the image that implements these changes while maintaining the overall style and quality of the original image.
    `

    // Generate content with the image
    const result = await model.generateContent([prompt, imageData])
    const response = await result.response

    // Extract the edited image as base64
    // Note: This assumes the Gemini model returns the image directly as base64
    // The actual implementation might need to be adjusted based on the API response format
    const parts = response.candidates[0].content.parts
    const imagePart = parts.find((part: any) => part.inlineData?.mimeType?.startsWith('image/'))
    
    if (!imagePart || !imagePart.inlineData?.data) {
      return {
        isSuccess: false,
        message: "لم يتمكن النموذج من تعديل الصورة"
      }
    }

    return {
      isSuccess: true,
      message: "تم تعديل الصورة بنجاح",
      data: {
        editedImageBase64: imagePart.inlineData.data
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
