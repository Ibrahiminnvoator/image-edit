/*
 * Defines the database schema for edits.
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { editStatusEnum } from "./enums"
import { profilesTable } from "./profiles-schema"

export const editsTable = pgTable("edits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => profilesTable.userId, { onDelete: "cascade" }),
  jobId: uuid("job_id").unique(),
  originalImageUrl: text("original_image_url").notNull(),
  originalImageFilename: text("original_image_filename").notNull(),
  editedImageUrl: text("edited_image_url"),
  editedImageFilename: text("edited_image_filename"),
  userPromptOriginal: text("user_prompt_original").notNull(),
  userPromptTranslated: text("user_prompt_translated"),
  imageDescriptionAi: text("image_description_ai"),
  status: editStatusEnum("status").notNull().default("pending"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertEdit = typeof editsTable.$inferInsert
export type SelectEdit = typeof editsTable.$inferSelect
