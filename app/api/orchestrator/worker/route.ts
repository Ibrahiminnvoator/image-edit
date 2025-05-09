/*
 * API route for the worker that processes image editing jobs in stages
 */

import {
  describeImageWithGeminiAction,
  detectLanguageAndTranslateWithGeminiAction,
  editImageWithGeminiAction
} from "@/actions/ai/gemini-actions"
import { updateEditAction } from "@/actions/db/edits-actions"
import {
  getPendingJobsForWorkerAction,
  updateImageProcessingJobAction
} from "@/actions/db/image-processing-jobs-actions"
import {
  getImagePublicUrlFromPathAction,
  uploadImageToSupabaseStorageAction
} from "@/actions/storage/image-storage-actions"
import { EDITED_IMAGES_BUCKET, ORIGINAL_IMAGES_BUCKET } from "@/lib/constants"
import { ImageMimeType, ImageProcessingStagePayload } from "@/types"
import { NextRequest, NextResponse } from "next/server"

// Helper function to convert a URL to base64
async function urlToBase64(
  url: string
): Promise<{ base64: string; mimeType: string }> {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const mimeType = response.headers.get("content-type") || "image/jpeg"

    return { base64, mimeType }
  } catch (error) {
    console.error("Error converting URL to base64:", error)
    throw new Error("Failed to convert image URL to base64")
  }
}

// Helper function to create a File object from base64
async function base64ToFile(
  base64: string,
  mimeType: string,
  filename: string
): Promise<File> {
  const res = await fetch(`data:${mimeType};base64,${base64}`)
  const blob = await res.blob()
  return new File([blob], filename, { type: mimeType })
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized with the CRON_SECRET
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get pending jobs
    const jobsResult = await getPendingJobsForWorkerAction(5)

    if (!jobsResult.isSuccess || jobsResult.data.length === 0) {
      return NextResponse.json({
        message: "No pending jobs found",
        processed: 0
      })
    }

    const jobs = jobsResult.data
    const results = []

    // Process each job
    for (const job of jobs) {
      try {
        const { id: jobId, currentStage, stagePayload, userId, editId } = job

        // Skip jobs without stage payload
        if (!stagePayload) {
          await updateImageProcessingJobAction(jobId, {
            currentStage: "failed",
            lastError: "Missing stage payload",
            retryCount: job.retryCount + 1
          })
          results.push({
            jobId,
            status: "failed",
            error: "Missing stage payload"
          })
          continue
        }

        // Process job based on current stage
        switch (currentStage) {
          case "pending_describe": {
            // Update job status to processing
            await updateImageProcessingJobAction(jobId, {
              currentStage: "describing_image"
            })

            // Get the original image URL from stage payload
            const { originalImageUrl } =
              stagePayload as ImageProcessingStagePayload
            if (!originalImageUrl) {
              throw new Error("Missing originalImageUrl in stage payload")
            }

            // Convert image URL to base64
            const { base64, mimeType } = await urlToBase64(originalImageUrl)

            // Describe the image using Gemini
            const descriptionResult = await describeImageWithGeminiAction(
              base64,
              mimeType
            )

            if (!descriptionResult.isSuccess) {
              throw new Error(
                `Failed to describe image: ${descriptionResult.message}`
              )
            }

            // Update job with the description and move to next stage
            await updateImageProcessingJobAction(jobId, {
              currentStage: "pending_translate",
              stagePayload: {
                ...stagePayload,
                aiImageDescription: descriptionResult.data.description
              }
            })

            // Update the edit record with the description
            await updateEditAction(editId, userId, {
              imageDescriptionAi: descriptionResult.data.description
            })

            results.push({ jobId, status: "describing_complete" })
            break
          }

          case "pending_translate": {
            // Update job status to processing
            await updateImageProcessingJobAction(jobId, {
              currentStage: "translating_prompt"
            })

            // Get the user prompt from stage payload
            const { userPrompt } = stagePayload as ImageProcessingStagePayload
            if (!userPrompt) {
              throw new Error("Missing userPrompt in stage payload")
            }

            // Detect language and translate if needed
            const translationResult =
              await detectLanguageAndTranslateWithGeminiAction(userPrompt)

            if (!translationResult.isSuccess) {
              throw new Error(
                `Failed to translate prompt: ${translationResult.message}`
              )
            }

            const { detectedLanguage, translatedText } = translationResult.data

            // Update job with the translation and move to next stage
            await updateImageProcessingJobAction(jobId, {
              currentStage: "pending_edit",
              stagePayload: {
                ...stagePayload,
                promptLanguage: detectedLanguage,
                translatedUserPrompt: translatedText || userPrompt
              }
            })

            // Update the edit record with the translated prompt
            await updateEditAction(editId, userId, {
              userPromptTranslated: translatedText || null
            })

            results.push({ jobId, status: "translation_complete" })
            break
          }

          case "pending_edit": {
            // Update job status to processing
            await updateImageProcessingJobAction(jobId, {
              currentStage: "editing_image"
            })

            // Get the required data from stage payload
            const {
              originalImageUrl,
              aiImageDescription,
              translatedUserPrompt,
              userPrompt,
              originalImageFilename
            } = stagePayload as ImageProcessingStagePayload

            if (
              !originalImageUrl ||
              !aiImageDescription ||
              (!translatedUserPrompt && !userPrompt)
            ) {
              throw new Error("Missing required data in stage payload")
            }

            // Convert image URL to base64
            const { base64, mimeType } = await urlToBase64(originalImageUrl)

            // Edit the image using Gemini
            const editResult = await editImageWithGeminiAction(
              base64,
              mimeType,
              aiImageDescription || "",
              translatedUserPrompt || userPrompt || ""
            )

            if (!editResult.isSuccess) {
              throw new Error(`Failed to edit image: ${editResult.message}`)
            }

            // Update job status to uploading result
            await updateImageProcessingJobAction(jobId, {
              currentStage: "uploading_result",
              stagePayload: {
                ...stagePayload,
                editedImageBase64: editResult.data.editedImageBase64
              }
            })

            // Convert the edited image base64 to a File
            const editedImageFile = await base64ToFile(
              editResult.data.editedImageBase64,
              mimeType as ImageMimeType,
              `edited_${originalImageFilename || "image.jpg"}`
            )

            // Upload the edited image to Supabase Storage
            const uploadResult = await uploadImageToSupabaseStorageAction(
              userId,
              editedImageFile,
              "edited",
              originalImageFilename || "image.jpg"
            )

            if (!uploadResult.isSuccess) {
              throw new Error(
                `Failed to upload edited image: ${uploadResult.message}`
              )
            }

            // Update job as completed
            await updateImageProcessingJobAction(jobId, {
              currentStage: "completed",
              stagePayload: {
                ...stagePayload,
                editedImageUrl: uploadResult.data.publicUrl
              }
            })

            // Update the edit record with the edited image URL and status
            await updateEditAction(editId, userId, {
              editedImageUrl: uploadResult.data.publicUrl,
              editedImageFilename: uploadResult.data.filename,
              status: "completed"
            })

            results.push({ jobId, status: "completed" })
            break
          }

          default:
            results.push({
              jobId,
              status: "skipped",
              message: `Unknown stage: ${currentStage}`
            })
        }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error)

        // Update job with error
        await updateImageProcessingJobAction(job.id, {
          lastError: error instanceof Error ? error.message : "Unknown error",
          retryCount: job.retryCount + 1,
          // If retry count is too high, mark as failed
          currentStage: job.retryCount >= 2 ? "failed" : job.currentStage
        })

        // If job is marked as failed, update the edit record too
        if (job.retryCount >= 2) {
          await updateEditAction(job.editId, job.userId, {
            status: "failed",
            errorMessage:
              error instanceof Error ? error.message : "Unknown error"
          })
        }

        results.push({
          jobId: job.id,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    return NextResponse.json({
      message: "Jobs processed",
      processed: results.length,
      results
    })
  } catch (error) {
    console.error("Error in orchestrator worker:", error)
    return NextResponse.json(
      { error: "Failed to process jobs" },
      { status: 500 }
    )
  }
}
