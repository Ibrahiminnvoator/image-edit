/*
This server layout provides a shared header and basic structure for (marketing) routes.
*/

import { Footer } from "@/components/landing/footer"
import Header from "@/components/landing/header"
import { AnalyticsTrackerWrapper } from "@/components/shared/analytics-tracker-wrapper"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Analytics tracking for marketing pages */}
      <AnalyticsTrackerWrapper />

      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
