/*
 * Database enums for AisarEdit
 */

import { pgEnum } from "drizzle-orm/pg-core"

// Edit status enum
export const editStatusEnum = pgEnum("edit_status", [
  "pending",
  "processing",
  "completed",
  "failed"
])

// Processing stage enum
export const processingStageEnum = pgEnum("processing_stage", [
  "pending_describe",
  "describing_image",
  "pending_translate",
  "translating_prompt",
  "pending_edit",
  "editing_image",
  "uploading_result",
  "completed",
  "failed"
])

// Re-export membership enum from profiles-schema.ts
export { membershipEnum } from "./profiles-schema"
