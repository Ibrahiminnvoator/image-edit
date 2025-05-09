/*
 * Defines the database schema for image processing jobs.
 */

import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core"
import { processingStageEnum } from "./enums"
import { profilesTable } from "./profiles-schema"

export const imageProcessingJobsTable = pgTable("image_processing_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  editId: uuid("edit_id").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  currentStage: processingStageEnum("current_stage")
    .notNull()
    .default("pending_describe"),
  stagePayload: jsonb("stage_payload"),
  retryCount: integer("retry_count").notNull().default(0),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertImageProcessingJob =
  typeof imageProcessingJobsTable.$inferInsert
export type SelectImageProcessingJob =
  typeof imageProcessingJobsTable.$inferSelect
