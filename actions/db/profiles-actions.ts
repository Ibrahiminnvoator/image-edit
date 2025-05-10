/*
Contains server actions related to profiles in the DB.
*/

"use server"

import { db } from "@/db/db"
import {
  InsertProfile,
  profilesTable,
  SelectProfile
} from "@/db/schema/profiles-schema"
import { AnalyticsEventType, trackEvent } from "@/lib/analytics"
import { MAX_DAILY_EDITS } from "@/lib/constants"
import { ActionState } from "@/types"
import { and, eq, sql } from "drizzle-orm"

export async function createProfileAction(
  data: InsertProfile
): Promise<ActionState<SelectProfile>> {
  try {
    const [newProfile] = await db.insert(profilesTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Profile created successfully",
      data: newProfile
    }
  } catch (error) {
    console.error("Error creating profile:", error)
    return { isSuccess: false, message: "Failed to create profile" }
  }
}

export async function getProfileByUserIdAction(
  userId: string
): Promise<ActionState<SelectProfile>> {
  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId)
    })
    if (!profile) {
      return { isSuccess: false, message: "Profile not found" }
    }

    return {
      isSuccess: true,
      message: "Profile retrieved successfully",
      data: profile
    }
  } catch (error) {
    console.error("Error getting profile by user id", error)
    return { isSuccess: false, message: "Failed to get profile" }
  }
}

export async function updateProfileAction(
  userId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning()

    if (!updatedProfile) {
      return { isSuccess: false, message: "Profile not found to update" }
    }

    return {
      isSuccess: true,
      message: "Profile updated successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { isSuccess: false, message: "Failed to update profile" }
  }
}

export async function updateProfileByStripeCustomerIdAction(
  stripeCustomerId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
      .returning()

    if (!updatedProfile) {
      return {
        isSuccess: false,
        message: "Profile not found by Stripe customer ID"
      }
    }

    return {
      isSuccess: true,
      message: "Profile updated by Stripe customer ID successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile by stripe customer ID:", error)
    return {
      isSuccess: false,
      message: "Failed to update profile by Stripe customer ID"
    }
  }
}

export async function deleteProfileAction(
  userId: string
): Promise<ActionState<void>> {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId))
    return {
      isSuccess: true,
      message: "Profile deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return { isSuccess: false, message: "Failed to delete profile" }
  }
}

/**
 * Creates or updates a profile when a user logs in
 * @param data The user data from Clerk
 * @returns The created or updated profile
 */
export async function createOrUpdateProfileOnLoginAction(
  data: { userId: string; email?: string | null }
): Promise<ActionState<SelectProfile>> {
  try {
    // Check if profile exists
    const profileResult = await getProfileByUserIdAction(data.userId)
    
    if (profileResult.isSuccess) {
      // Update email if it changed
      if (data.email && profileResult.data.email !== data.email) {
        return updateProfileAction(data.userId, { email: data.email })
      }
      return profileResult
    }
    
    // Create new profile
    const result = await createProfileAction({
      userId: data.userId,
      email: data.email || null,
      dailyEditCount: 0,
      lastEditDate: new Date(),
    })
    
    // Track user signup event with enhanced Google Analytics parameters
    if (result.isSuccess) {
      trackEvent(AnalyticsEventType.USER_SIGNUP, { 
        userId: data.userId,
        email: data.email,
        event_category: "user_lifecycle",
        event_label: "new_signup",
        timestamp: new Date().toISOString(),
        signup_method: "clerk"
      })
    }
    
    return result
  } catch (error) {
    console.error("Error in createOrUpdateProfileOnLoginAction:", error)
    return { isSuccess: false, message: "فشل في إنشاء أو تحديث الملف الشخصي" }
  }
}

/**
 * Checks if a user has reached their daily edit limit and increments the count if not
 * @param userId The user ID
 * @returns Whether the limit has been reached and how many edits remain
 */
export async function checkAndIncrementUsageAction(
  userId: string
): Promise<ActionState<{ limitReached: boolean; remainingEdits: number }>> {
  try {
    // Get the profile
    const profileResult = await getProfileByUserIdAction(userId)
    
    if (!profileResult.isSuccess) {
      return { isSuccess: false, message: "لم يتم العثور على الملف الشخصي" }
    }
    
    const profile = profileResult.data
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const lastEditDate = profile.lastEditDate 
      ? profile.lastEditDate.toISOString().split('T')[0]
      : null
    
    // If last edit date is not today, reset the count
    if (!lastEditDate || lastEditDate !== today) {
      const updatedProfile = await updateProfileAction(userId, {
        dailyEditCount: 1,
        lastEditDate: new Date()
      })
      
      if (!updatedProfile.isSuccess) {
        return { isSuccess: false, message: "فشل في تحديث عداد التعديلات" }
      }
      
      return {
        isSuccess: true,
        message: "تم تحديث عداد التعديلات",
        data: {
          limitReached: false,
          remainingEdits: MAX_DAILY_EDITS - 1
        }
      }
    }
    
    // Check if the limit has been reached
    if (profile.dailyEditCount >= MAX_DAILY_EDITS) {
      // Track daily limit reached event with enhanced Google Analytics parameters
      trackEvent(AnalyticsEventType.DAILY_LIMIT_REACHED, { 
        userId,
        dailyEditCount: profile.dailyEditCount,
        membership: profile.membership,
        event_category: "user_limits",
        event_label: "daily_limit_reached",
        timestamp: new Date().toISOString(),
        max_daily_edits: MAX_DAILY_EDITS
      })
      
      return {
        isSuccess: true,
        message: "تم الوصول إلى الحد اليومي للتعديلات",
        data: {
          limitReached: true,
          remainingEdits: 0
        }
      }
    }
    
    // Increment the count
    const updatedProfile = await updateProfileAction(userId, {
      dailyEditCount: profile.dailyEditCount + 1,
      lastEditDate: new Date()
    })
    
    if (!updatedProfile.isSuccess) {
      return { isSuccess: false, message: "فشل في تحديث عداد التعديلات" }
    }
    
    return {
      isSuccess: true,
      message: "تم تحديث عداد التعديلات",
      data: {
        limitReached: false,
        remainingEdits: MAX_DAILY_EDITS - (profile.dailyEditCount + 1)
      }
    }
  } catch (error) {
    console.error("Error in checkAndIncrementUsageAction:", error)
    return { isSuccess: false, message: "حدث خطأ أثناء التحقق من حد التعديلات اليومي" }
  }
}
