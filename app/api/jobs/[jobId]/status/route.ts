/*
 * API route for polling the status of an image processing job
 */

import { getImageProcessingJobByIdAction } from "@/actions/db/image-processing-jobs-actions"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  context: { params: { jobId: string } }
) {
  const { params } = context
  try {
    // Authenticate user
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId } = params

    // Get the job status
    const jobResult = await getImageProcessingJobByIdAction(jobId, userId)

    if (!jobResult.isSuccess) {
      return NextResponse.json({ error: jobResult.message }, { status: 404 })
    }

    // Return the job status
    const job = jobResult.data
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({
      status: job.currentStage,
      stagePayload: job.stagePayload,
      retryCount: job.retryCount,
      lastError: job.lastError,
      updatedAt: job.updatedAt
    })
  } catch (error) {
    console.error("Error in job status API:", error)
    return NextResponse.json(
      { error: "Failed to get job status" },
      { status: 500 }
    )
  }
}
