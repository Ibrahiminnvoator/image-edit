/*
 * Dashboard page for AisarEdit
 */

import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { MAX_DAILY_EDITS } from "@/lib/constants"
import { auth } from "@clerk/nextjs/server"
import { Edit, History, Zap } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "أَيْسَر | AisarEdit - لوحة التحكم",
  description: "لوحة التحكم الرئيسية لتطبيق أيسر لتعديل الصور"
}

export default async function DashboardPage() {
  // Get the user ID from auth
  const { userId } = await auth()
  if (!userId) {
    redirect("/login")
  }

  // Get the user's profile to display remaining edits
  const profileResult = await getProfileByUserIdAction(userId)
  const profile = profileResult.isSuccess ? profileResult.data : null

  // Calculate remaining edits
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
  const lastEditDate = profile?.lastEditDate
    ? profile.lastEditDate.toISOString().split("T")[0]
    : null

  // If last edit date is not today, reset the count
  const dailyEditCount =
    lastEditDate === today ? profile?.dailyEditCount || 0 : 0
  const remainingEdits = MAX_DAILY_EDITS - dailyEditCount

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-2">
          هلا بك في أيسر، تطبيق تعديل الصور بالذكاء الاصطناعي
        </p>
      </div>

      {/* User stats */}
      <div className="bg-card rounded-lg border p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="bg-primary/10 self-start rounded-full p-3 sm:self-auto">
            <Zap className="text-primary size-6 sm:size-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">
              باقي لك {remainingEdits} تعديلات اليوم
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {remainingEdits > 0
                ? "ترا يتجدد رصيدك كل يوم، استخدمه قبل ما يخلص!"
                : "خلصت تعديلاتك لليوم، تعال بكرة وحتلقى رصيد جديد!"}
            </p>
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card className="border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-md p-1.5">
                <Edit className="text-primary size-4 sm:size-5" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                تعديل صورة جديدة
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              حمّل صورتك وقول لنا وش تبي نسوي فيها
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-4">
            <p className="text-xs sm:text-sm">
              استخدم الذكاء الاصطناعي عشان تعدل صورك بسهولة. بس قول لنا وش تبي
              بالضبط وحنا نسويه لك.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/edit" className="w-full">
              <Button className="h-auto w-full py-2 text-sm sm:h-10 sm:text-base">
                ابدأ تعديل جديد
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-md p-1.5">
                <History className="text-primary size-4 sm:size-5" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                سجل التعديلات
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              شوف التعديلات اللي سويتها من قبل
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-4">
            <p className="text-xs sm:text-sm">
              استعرض كل الصور اللي عدلتها سابقاً، وشوف الصور قبل وبعد التعديل،
              وحمّل اللي تبيه منها.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/history" className="w-full">
              <Button
                variant="outline"
                className="h-auto w-full py-2 text-sm sm:h-10 sm:text-base"
              >
                عرض السجل
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
