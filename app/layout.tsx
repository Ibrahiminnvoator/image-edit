/*
The root server layout for the app.
*/

import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { GoogleAnalytics } from "@/components/shared/google-analytics"
import { auth, currentUser } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { tajawal } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "أَيْسَر | AisarEdit",
  description: "تعديل الصور باستخدام الذكاء الاصطناعي"
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (userId) {
    // Get user data from Clerk
    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress || null

    // Create or update profile in Supabase
    const { createOrUpdateProfileOnLoginAction } = await import(
      "@/actions/db/profiles-actions"
    )
    await createOrUpdateProfileOnLoginAction({ userId, email })
  }

  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background font-tajawal mx-auto min-h-screen w-full scroll-smooth antialiased",
            tajawal.variable
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {/* Google Analytics */}
            <GoogleAnalytics />

            {children}

            <TailwindIndicator />

            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
