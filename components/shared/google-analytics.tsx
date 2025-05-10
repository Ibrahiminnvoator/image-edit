"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Initialize GA with the measurement ID
export const GoogleAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize GA when the component mounts
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn(
        "Google Analytics Measurement ID not provided in environment variables"
      )
      return
    }

    try {
      // Mark as initialized so we don't try to initialize again
      setIsInitialized(true)
      console.log("Google Analytics initialized with ID:", GA_MEASUREMENT_ID)
    } catch (error) {
      console.error("Error initializing Google Analytics:", error)
    }
  }, [])

  // Track page views when the route changes
  useEffect(() => {
    if (
      !isInitialized ||
      !GA_MEASUREMENT_ID ||
      typeof window === "undefined" ||
      !window.gtag
    )
      return

    try {
      // When the path changes, log a page view
      const url = pathname + searchParams.toString()

      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url
      })
      console.log("Google Analytics page view tracked:", url)
    } catch (error) {
      console.error("Error tracking page view:", error)
    }
  }, [isInitialized, pathname, searchParams])

  // Don't render anything if GA is not configured
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `
        }}
      />
    </>
  )
}

// Helper functions to use throughout the app
export const logEvent = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return

  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value: value
  })
}

// Declare gtag as a global to avoid TypeScript errors
declare global {
  interface Window {
    gtag: (
      command: string,
      target: string,
      config?: Record<string, unknown>
    ) => void
  }
}
