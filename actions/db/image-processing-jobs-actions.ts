/*
 * Server actions for managing image processing jobs in the database
 */

"use server"

import { db } from "@/db/db"
import { imageProcessingJobsTable, InsertImageProcessingJob, SelectImageProcessingJob } from "@/db/schema"
import { ActionState } from "@/types"
import { and, asc, eq, ne, or } from "drizzle-orm"

/**
 * Creates a new image processing job
 * @param data The job data to insert
 * @returns The created job
 */
export async function createImageProcessingJobAction(
  data: InsertImageProcessingJob
): Promise<ActionState<SelectImageProcessingJob>> {
  try {
    const [newJob] = await db.insert(imageProcessingJobsTable).values(data).returning()
    
    return {
      isSuccess: true,
      message: "تم إنشاء مهمة المعالجة بنجاح",
      data: newJob
    }
  } catch (error) {
    console.error("Error creating image processing job:", error)
    return { 
      isSuccess: false, 
      message: "فشل في إنشاء مهمة المعالجة" 
    }
  }
}

/**
 * Gets an image processing job by its ID
 * @param jobId The job ID
 * @param userId The user ID (for authorization)
 * @returns The job if found and owned by the user
 */
export async function getImageProcessingJobByIdAction(
  jobId: string,
  userId: string
): Promise<ActionState<SelectImageProcessingJob | null>> {
  try {
    const job = await db.query.imageProcessingJobs.findFirst({
      where: and(
        eq(imageProcessingJobsTable.id, jobId),
        eq(imageProcessingJobsTable.userId, userId)
      )
    })
    
    if (!job) {
      return { 
        isSuccess: false, 
        message: "لم يتم العثور على مهمة المعالجة" 
      }
    }

    return {
      isSuccess: true,
      message: "تم العثور على مهمة المعالجة",
      data: job
    }
  } catch (error) {
    console.error("Error getting image processing job by id:", error)
    return { 
      isSuccess: false, 
      message: "فشل في الحصول على مهمة المعالجة" 
    }
  }
}

/**
 * Updates an image processing job
 * @param jobId The job ID
 * @param data The data to update
 * @returns The updated job
 */
export async function updateImageProcessingJobAction(
  jobId: string,
  data: Partial<Omit<InsertImageProcessingJob, 'id' | 'userId' | 'editId' | 'createdAt'>>
): Promise<ActionState<SelectImageProcessingJob>> {
  try {
    const [updatedJob] = await db
      .update(imageProcessingJobsTable)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(imageProcessingJobsTable.id, jobId))
      .returning()

    if (!updatedJob) {
      return { 
        isSuccess: false, 
        message: "فشل في تحديث مهمة المعالجة" 
      }
    }

    return {
      isSuccess: true,
      message: "تم تحديث مهمة المعالجة بنجاح",
      data: updatedJob
    }
  } catch (error) {
    console.error("Error updating image processing job:", error)
    return { 
      isSuccess: false, 
      message: "فشل في تحديث مهمة المعالجة" 
    }
  }
}

/**
 * Gets pending jobs for the worker to process
 * @param limit Maximum number of jobs to fetch
 * @returns Array of pending jobs
 */
export async function getPendingJobsForWorkerAction(
  limit: number = 5
): Promise<ActionState<SelectImageProcessingJob[]>> {
  try {
    const jobs = await db.query.imageProcessingJobs.findMany({
      where: and(
        or(
          eq(imageProcessingJobsTable.currentStage, "pending_describe"),
          eq(imageProcessingJobsTable.currentStage, "pending_translate"),
          eq(imageProcessingJobsTable.currentStage, "pending_edit")
        ),
        // Exclude jobs that have failed too many times (retry_count >= 3)
        ne(imageProcessingJobsTable.retryCount, 3)
      ),
      orderBy: [asc(imageProcessingJobsTable.createdAt)],
      limit
    })

    return {
      isSuccess: true,
      message: `تم العثور على ${jobs.length} مهمة معالجة معلقة`,
      data: jobs
    }
  } catch (error) {
    console.error("Error getting pending jobs for worker:", error)
    return { 
      isSuccess: false, 
      message: "فشل في الحصول على مهام المعالجة المعلقة" 
    }
  }
}
