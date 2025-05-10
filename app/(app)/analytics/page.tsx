/*
 * Analytics dashboard page for AisarEdit
 */

import { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "./_components/analytics-dashboard"

export const metadata: Metadata = {
  title: "أَيْسَر | AisarEdit - تحليلات الاستخدام",
  description: "تحليلات استخدام تطبيق أيسر لتعديل الصور"
}

export default async function AnalyticsPage() {
  // Check if user is authenticated
  const { userId } = await auth()
  if (!userId) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">تحليلات الاستخدام</h1>
        <p className="text-muted-foreground">
          تابع استخدام التطبيق وتفاعل المستخدمين مع خدمة تعديل الصور
        </p>
      </div>

      <AnalyticsDashboard userId={userId} />
    </div>
  )
}
