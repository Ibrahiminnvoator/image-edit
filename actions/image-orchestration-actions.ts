/*
 * Server actions for orchestrating the image editing process
 */

"use server"

import { createEditAction } from "@/actions/db/edits-actions"
import { createImageProcessingJobAction } from "@/actions/db/image-processing-jobs-actions"
import { checkAndIncrementUsageAction } from "@/actions/db/profiles-actions"
import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"

/**
 * Starts the image editing process
 * @param originalImagePublicUrl The public URL of the original image
 * @param originalImageFilename The filename of the original image
 * @param userPrompt The user's prompt describing the desired edits
 * @returns The job ID for tracking the process
 */
export async function startImageEditProcessAction(
  originalImagePublicUrl: string,
  originalImageFilename: string,
  userPrompt: string
): Promise<ActionState<{ jobId: string }>> {
  try {
    // Authenticate user
    const { userId } = await auth()
    if (!userId) {
      return {
        isSuccess: false,
        message: "يجب تسجيل الدخول لاستخدام هذه الميزة"
      }
    }

    // Check usage limits
    const usageResult = await checkAndIncrementUsageAction(userId)
    if (!usageResult.isSuccess) {
      return {
        isSuccess: false,
        message: usageResult.message
      }
    }

    if (usageResult.data.limitReached) {
      return {
        isSuccess: false,
        message: "لقد وصلت إلى الحد اليومي للتعديلات. يرجى المحاولة مرة أخرى غدًا."
      }
    }

    // Create an edit record
    const editResult = await createEditAction({
      userId,
      originalImageUrl: originalImagePublicUrl,
      originalImageFilename,
      userPromptOriginal: userPrompt,
      status: "pending"
    })

    if (!editResult.isSuccess) {
      return {
        isSuccess: false,
        message: editResult.message
      }
    }

    // Create an image processing job
    const jobResult = await createImageProcessingJobAction({
      editId: editResult.data.id,
      userId,
      currentStage: "pending_describe",
      stagePayload: {
        originalImageUrl: originalImagePublicUrl,
        originalImageFilename,
        userPrompt
      }
    })

    if (!jobResult.isSuccess) {
      return {
        isSuccess: false,
        message: jobResult.message
      }
    }

    // Update the edit record with the job ID
    await updateEditWithJobId(editResult.data.id, jobResult.data.id)

    return {
      isSuccess: true,
      message: "تم بدء عملية تعديل الصورة بنجاح",
      data: {
        jobId: jobResult.data.id
      }
    }
  } catch (error) {
    console.error("Error in startImageEditProcessAction:", error)
    return {
      isSuccess: false,
      message: "حدث خطأ أثناء بدء عملية تعديل الصورة"
    }
  }
}

/**
 * Updates an edit record with the job ID
 * @param editId The edit ID
 * @param jobId The job ID
 */
async function updateEditWithJobId(editId: string, jobId: string): Promise<void> {
  try {
    // Import here to avoid circular dependencies
    const { updateEditAction } = await import("@/actions/db/edits-actions")
    
    // Get the userId from the auth context
    const { userId } = await auth()
    if (!userId) {
      throw new Error("User not authenticated")
    }
    
    await updateEditAction(editId, userId, {
      jobId
    })
  } catch (error) {
    console.error("Error updating edit with job ID:", error)
    // We don't throw here to avoid breaking the main flow
    // The job will still be created and can be linked later if needed
  }
}
