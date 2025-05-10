/*
 * History page for AisarEdit - displays user's image editing history
 */

import { getEditsByUserIdAction } from "@/actions/db/edits-actions"
import { HistoryList } from "./_components/history-list"
import { HistoryListSkeleton } from "./_components/history-list-skeleton"
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "أَيْسَر | AisarEdit - سجل التعديلات",
  description: "استعرض تاريخ التعديلات السابقة التي قمت بها"
}

// Server component to fetch edits
async function HistoryContent() {
  // Get the user ID from auth
  const { userId } = await auth()
  if (!userId) {
    redirect("/login")
  }

  // Fetch user's edit history
  const editsResult = await getEditsByUserIdAction(userId)

  if (!editsResult.isSuccess) {
    return (
      <div className="bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive font-medium">
          حدث خطأ أثناء جلب سجل التعديلات
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          {editsResult.message || "يرجى المحاولة مرة أخرى لاحقاً"}
        </p>
      </div>
    )
  }

  const edits = editsResult.data

  if (edits.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">ما عندك أي تعديلات للحين</h2>
        <p className="text-muted-foreground mb-4">
          لما تسوي تعديلات على صورك، راح تظهر هنا
        </p>
        <a
          href="/edit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded px-4 py-2 text-sm font-medium"
        >
          ابدأ أول تعديل
        </a>
      </div>
    )
  }

  return <HistoryList edits={edits} />
}

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">سجل التعديلات</h1>
        <p className="text-muted-foreground mt-2">
          شوف كل الصور اللي عدلتها سابقاً
        </p>
      </div>

      <Suspense fallback={<HistoryListSkeleton />}>
        <HistoryContent />
      </Suspense>
    </div>
  )
}
