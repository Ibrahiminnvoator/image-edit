/*
 * Application-wide constants for AisarEdit
 */

// Image upload configuration
export const MAX_IMAGE_UPLOAD_MB = Number(
  process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD_MB || 5
)
export const MAX_IMAGE_UPLOAD_SIZE_BYTES = MAX_IMAGE_UPLOAD_MB * 1024 * 1024
export const ALLOWED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/webp"]

// Usage limits
export const MAX_DAILY_EDITS = Number(
  process.env.AISEREDIT_MAX_DAILY_EDITS || 5
)

// Storage bucket names
export const ORIGINAL_IMAGES_BUCKET =
  process.env.AISEREDIT_ORIGINAL_IMAGES_BUCKET || "aisaredit-original-images"
export const EDITED_IMAGES_BUCKET =
  process.env.AISEREDIT_EDITED_IMAGES_BUCKET || "aisaredit-edited-images"
