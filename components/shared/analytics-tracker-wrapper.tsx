"use client"

import { AnalyticsTracker } from "./analytics-tracker"
import { usePathname } from "next/navigation"

/**
 * Client component wrapper for the AnalyticsTracker
 * This is needed because the marketing layout is a server component
 */
export function AnalyticsTrackerWrapper() {
  const pathname = usePathname()

  // Determine the page name based on the pathname
  let pageName = "landing-page"
  if (pathname.includes("/privacy")) {
    pageName = "privacy-page"
  } else if (pathname.includes("/terms")) {
    pageName = "terms-page"
  }

  return <AnalyticsTracker pageName={pageName} />
}
