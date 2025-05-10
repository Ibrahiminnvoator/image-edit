/*
 * Analytics tracking for AisarEdit
 * This is a stub implementation that can be replaced with a real analytics provider
 */

// Event types for tracking
export enum AnalyticsEventType {
  PAGE_VIEW = "page_view",
  USER_SIGNUP = "user_signup",
  USER_LOGIN = "user_login",
  EDIT_SUBMITTED = "edit_submitted",
  EDIT_COMPLETED = "edit_completed",
  EDIT_FAILED = "edit_failed",
  DAILY_LIMIT_REACHED = "daily_limit_reached",
  IMAGE_SELECTED = "image_selected",
  EDIT_FORM_SUBMITTED = "edit_form_submitted"
}

// Analytics provider interface
interface AnalyticsProvider {
  initialize(): void
  trackEvent(eventType: string, properties?: Record<string, any>): void
  trackPageView(pageName: string, url: string): void
  setUser(userId: string, userProperties?: Record<string, any>): void
}

// Console logger provider (development)
class ConsoleAnalyticsProvider implements AnalyticsProvider {
  initialize(): void {
    console.log("[Analytics] Initialized console provider")
  }

  trackEvent(eventType: string, properties?: Record<string, any>): void {
    console.log(`[Analytics] Event: ${eventType}`, properties)
  }

  trackPageView(pageName: string, url: string): void {
    console.log(`[Analytics] Page View: ${pageName}`, { url })
  }

  setUser(userId: string, userProperties?: Record<string, any>): void {
    console.log(`[Analytics] Set User: ${userId}`, userProperties)
  }
}

// Google Analytics provider (production)
class GoogleAnalyticsProvider implements AnalyticsProvider {
  private isInitialized = false

  initialize(): void {
    // GA is initialized via the GoogleAnalytics component
    // This just marks our provider as ready
    this.isInitialized = true
    console.log("[Analytics] Initialized Google Analytics provider")
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      this.initialize()
    }
  }

  trackEvent(eventType: string, properties?: Record<string, any>): void {
    this.ensureInitialized()

    // Skip if we're on the server or gtag isn't available
    if (typeof window === "undefined" || !window.gtag) return

    // Convert our event type and properties to GA4 format
    const eventName = eventType.toLowerCase().replace(/_/g, "_")

    // Send the event to GA
    window.gtag("event", eventName, properties || {})
  }

  trackPageView(pageName: string, url: string): void {
    this.ensureInitialized()

    // Skip if we're on the server or gtag isn't available
    if (typeof window === "undefined" || !window.gtag) return

    // Send the page view to GA
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
      page_title: pageName,
      page_path: url
    })
  }

  setUser(userId: string, userProperties?: Record<string, any>): void {
    this.ensureInitialized()

    // Skip if we're on the server or gtag isn't available
    if (typeof window === "undefined" || !window.gtag) return

    // Set user properties in GA
    window.gtag("set", "user_properties", {
      user_id: userId,
      ...userProperties
    })

    // Also set the user ID for better cross-device tracking
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
      user_id: userId
    })
  }
}

// Analytics service
class AnalyticsService {
  private provider: AnalyticsProvider
  private static instance: AnalyticsService

  private constructor() {
    // Choose provider based on environment
    const isProduction = process.env.NODE_ENV === "production"
    this.provider = isProduction
      ? new GoogleAnalyticsProvider()
      : new ConsoleAnalyticsProvider()

    this.provider.initialize()
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  public trackEvent(
    eventType: AnalyticsEventType | string,
    properties?: Record<string, any>
  ): void {
    this.provider.trackEvent(eventType, properties)
  }

  public trackPageView(pageName: string, url: string): void {
    this.provider.trackPageView(pageName, url)
  }

  public setUser(userId: string, userProperties?: Record<string, any>): void {
    this.provider.setUser(userId, userProperties)
  }
}

// Public API
export function trackEvent(
  eventType: AnalyticsEventType | string,
  properties?: Record<string, any>
): void {
  // Ensure this works on both client and server side
  if (typeof window !== "undefined") {
    // Client-side tracking
    AnalyticsService.getInstance().trackEvent(eventType, properties)
  } else {
    // Server-side tracking (simplified for now)
    console.log(`[Server Analytics] Event: ${eventType}`, properties)
  }

  // In production, this would send to an analytics provider
  // Example implementation for a real provider:
  //
  // if (typeof window !== 'undefined' && window.analytics) {
  //   window.analytics.track(eventName, properties)
  // }
}

/**
 * Track a page view
 * @param pageName The name of the page being viewed
 * @param properties Optional properties to include with the event
 */
export function trackPageView(
  pageName: string,
  properties?: Record<string, any>
): void {
  trackEvent(AnalyticsEventType.PAGE_VIEW, {
    page: pageName,
    ...properties
  })
}

/**
 * Initialize analytics
 * Call this once at app startup
 */
export function initAnalytics(): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics] Initialized in development mode")
    return
  }

  // In production, this would initialize the analytics provider
  // Example:
  //
  // if (typeof window !== 'undefined') {
  //   // Initialize analytics provider
  //   // e.g., PostHog, Mixpanel, etc.
  // }
}
