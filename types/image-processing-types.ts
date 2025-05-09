/*
 * Types related to image processing for AisarEdit
 */

// Allowed image MIME types
export type ImageMimeType = "image/jpeg" | "image/png" | "image/webp"

// Image processing stage payload structure
export interface ImageProcessingStagePayload {
  originalImageUrl?: string
  originalImageFilename?: string
  userPrompt?: string
  aiImageDescription?: string
  promptLanguage?: "ar" | "en"
  translatedUserPrompt?: string
  editedImageBase64?: string
  editedImageUrl?: string
}

// Image upload result
export interface ImageUploadResult {
  publicUrl: string
  path: string
  filename: string
}
