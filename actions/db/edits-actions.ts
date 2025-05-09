/*
 * Server actions for managing edits in the database
 */

"use server"

import { db } from "@/db/db"
import { editsTable, InsertEdit, SelectEdit } from "@/db/schema"
import { ActionState } from "@/types"
import { and, desc, eq } from "drizzle-orm"

/**
 * Creates a new edit record
 * @param data The edit data to insert
 * @returns The created edit
 */
export async function createEditAction(
  data: InsertEdit
): Promise<ActionState<SelectEdit>> {
  try {
    const [newEdit] = await db.insert(editsTable).values(data).returning()
    
    return {
      isSuccess: true,
      message: "تم إنشاء التعديل بنجاح",
      data: newEdit
    }
  } catch (error) {
    console.error("Error creating edit:", error)
    return { 
      isSuccess: false, 
      message: "فشل في إنشاء التعديل" 
    }
  }
}

/**
 * Gets an edit by its ID
 * @param editId The edit ID
 * @param userId The user ID (for authorization)
 * @returns The edit if found and owned by the user
 */
export async function getEditByIdAction(
  editId: string,
  userId: string
): Promise<ActionState<SelectEdit | null>> {
  try {
    const edit = await db.query.edits.findFirst({
      where: and(
        eq(editsTable.id, editId),
        eq(editsTable.userId, userId)
      )
    })
    
    if (!edit) {
      return { 
        isSuccess: false, 
        message: "لم يتم العثور على التعديل" 
      }
    }

    return {
      isSuccess: true,
      message: "تم العثور على التعديل",
      data: edit
    }
  } catch (error) {
    console.error("Error getting edit by id:", error)
    return { 
      isSuccess: false, 
      message: "فشل في الحصول على التعديل" 
    }
  }
}

/**
 * Updates an edit
 * @param editId The edit ID
 * @param userId The user ID (for authorization)
 * @param data The data to update
 * @returns The updated edit
 */
export async function updateEditAction(
  editId: string,
  userId: string,
  data: Partial<Omit<InsertEdit, 'id' | 'userId' | 'createdAt'>>
): Promise<ActionState<SelectEdit>> {
  try {
    // First check if the edit exists and belongs to the user
    const editExists = await db.query.edits.findFirst({
      where: and(
        eq(editsTable.id, editId),
        eq(editsTable.userId, userId)
      )
    })
    
    if (!editExists) {
      return { 
        isSuccess: false, 
        message: "لم يتم العثور على التعديل أو ليس لديك صلاحية تعديله" 
      }
    }
    
    const [updatedEdit] = await db
      .update(editsTable)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(and(
        eq(editsTable.id, editId),
        eq(editsTable.userId, userId)
      ))
      .returning()

    if (!updatedEdit) {
      return { 
        isSuccess: false, 
        message: "فشل في تحديث التعديل" 
      }
    }

    return {
      isSuccess: true,
      message: "تم تحديث التعديل بنجاح",
      data: updatedEdit
    }
  } catch (error) {
    console.error("Error updating edit:", error)
    return { 
      isSuccess: false, 
      message: "فشل في تحديث التعديل" 
    }
  }
}

/**
 * Gets all edits for a user with optional pagination
 * @param userId The user ID
 * @param limit Optional limit for pagination
 * @param offset Optional offset for pagination
 * @returns Array of edits
 */
export async function getEditsByUserIdAction(
  userId: string,
  limit?: number,
  offset?: number
): Promise<ActionState<SelectEdit[]>> {
  try {
    const edits = await db.query.edits.findMany({
      where: eq(editsTable.userId, userId),
      orderBy: [desc(editsTable.createdAt)],
      limit: limit || undefined,
      offset: offset || undefined
    })

    return {
      isSuccess: true,
      message: `تم العثور على ${edits.length} تعديل`,
      data: edits
    }
  } catch (error) {
    console.error("Error getting edits by user id:", error)
    return { 
      isSuccess: false, 
      message: "فشل في الحصول على التعديلات" 
    }
  }
}
