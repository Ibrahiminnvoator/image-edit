/*
 * Layout for authenticated sections of the AisarEdit app
 */

import { Sidebar } from "@/components/shared/sidebar"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { MobileNav } from "@/components/shared/mobile-nav"
import { AnalyticsTracker } from "@/components/shared/analytics-tracker"
import { AnalyticsEventType, trackEvent } from "@/lib/analytics"
import { auth, currentUser } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "أَيْسَر | AisarEdit - لوحة التحكم",
  description: "تعديل الصور باستخدام الذكاء الاصطناعي"
}

export default async function AppLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const { userId } = await auth()
  if (!userId) {
    redirect("/login")
  }

  // Track user login event
  trackEvent(AnalyticsEventType.USER_LOGIN, { userId })

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Analytics tracking */}
      <AnalyticsTracker userId={userId} pageName="authenticated-page" />

      {/* Mobile-optimized header */}
      <div className="bg-background sticky top-0 z-40 w-full border-b md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="text-primary text-xl font-bold">أَيْسَر</div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8"
                }
              }}
            />
            <MobileNav />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Desktop header with user controls */}
          <div className="hidden items-center justify-end gap-4 pb-6 md:flex">
            <ThemeToggle />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10"
                }
              }}
            />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
