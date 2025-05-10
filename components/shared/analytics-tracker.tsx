"use client"

import { trackPageView } from "@/lib/analytics"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

interface AnalyticsTrackerProps {
  userId?: string
  pageName: string
}

/**
 * Component to track page views and set user identity for analytics
 * Place this in layout files or individual pages to track views
 */
export function AnalyticsTracker({ userId, pageName }: AnalyticsTrackerProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view when component mounts or pathname changes
    trackPageView(pageName, { url: pathname })

    // Set user identity if available - disabled for now until we implement this feature
    // if (userId) {
    //   // Track user identity
    // }
  }, [pathname, pageName, userId])

  // This component doesn't render anything
  return null
}
