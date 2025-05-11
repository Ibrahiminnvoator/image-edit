/*
 * Server actions for handling image storage in Supabase
 */

"use server"

import { db } from "@/db/db"
import { ALLOWED_IMAGE_FORMATS, EDITED_IMAGES_BUCKET, MAX_IMAGE_UPLOAD_SIZE_BYTES, ORIGINAL_IMAGES_BUCKET } from "@/lib/constants"
import { ActionState, ImageMimeType, ImageUploadResult } from "@/types"
import { createClient } from "@supabase/supabase-js"

/**
 * Uploads an image to Supabase Storage
 * @param userId The user ID
 * @param file The file to upload
 * @param type Whether this is an original or edited image
 * @param originalFileName The original file name
 * @returns The public URL, path, and filename of the uploaded image
 */
export async function uploadImageToSupabaseStorageAction(
  userId: string,
  file: File,
  type: "original" | "edited",
  originalFileName: string
): Promise<ActionState<ImageUploadResult>> {
  try {
    // Validate file type
    if (!ALLOWED_IMAGE_FORMATS.includes(file.type as ImageMimeType)) {
      return {
        isSuccess: false,
        message: "صيغة الملف غير مدعومة. الصيغ المدعومة هي: JPEG, PNG, WebP"
      }
    }

    // Validate file size
    if (file.size > MAX_IMAGE_UPLOAD_SIZE_BYTES) {
      return {
        isSuccess: false,
        message: `حجم الملف كبير جدًا. الحد الأقصى هو ${MAX_IMAGE_UPLOAD_SIZE_BYTES / (1024 * 1024)} ميجابايت`
      }
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    // Determine bucket name based on type
    const bucketName = type === "original" ? ORIGINAL_IMAGES_BUCKET : EDITED_IMAGES_BUCKET

    // Create a unique filename with timestamp
    const timestamp = new Date().getTime()
    const fileExtension = originalFileName.split(".").pop() || ""
    const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${sanitizedFileName}`

    // Create the file path
    const path = `${userId}/${filename}`

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error("Error uploading file:", error)
      return {
        isSuccess: false,
        message: "حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى."
      }
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(path)

    return {
      isSuccess: true,
      message: "تم رفع الملف بنجاح",
      data: {
        publicUrl: publicUrlData.publicUrl,
        path: data.path,
        filename: filename
      }
    }
  } catch (error) {
    console.error("Error in uploadImageToSupabaseStorageAction:", error)
    return {
      isSuccess: false,
      message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
    }
  }
}

/**
 * Gets the public URL for an image in Supabase Storage
 * @param path The path to the image
 * @param bucketName The bucket name (defaults to edited images bucket)
 * @returns The public URL of the image
 */
export async function getImagePublicUrlFromPathAction(
  path: string,
  bucketName: string = EDITED_IMAGES_BUCKET
): Promise<ActionState<{ publicUrl: string }>> {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path)

    return {
      isSuccess: true,
      message: "تم الحصول على رابط الصورة بنجاح",
      data: {
        publicUrl: data.publicUrl
      }
    }
  } catch (error) {
    console.error("Error in getImagePublicUrlFromPathAction:", error)
    return {
      isSuccess: false,
      message: "حدث خطأ أثناء الحصول على رابط الصورة"
    }
  }
}
