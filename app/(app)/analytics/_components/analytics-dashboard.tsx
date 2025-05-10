"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { AnalyticsChart } from "./analytics-chart"
import { AnalyticsMetric } from "./analytics-metric"
import { AnalyticsTable } from "./analytics-table"

interface AnalyticsDashboardProps {
  userId: string
}

// Mock data for demonstration purposes
// In a real implementation, this would be fetched from your analytics API
const mockPageViews = [
  { date: "2025-05-01", count: 120 },
  { date: "2025-05-02", count: 145 },
  { date: "2025-05-03", count: 132 },
  { date: "2025-05-04", count: 167 },
  { date: "2025-05-05", count: 189 },
  { date: "2025-05-06", count: 204 },
  { date: "2025-05-07", count: 215 },
  { date: "2025-05-08", count: 247 },
  { date: "2025-05-09", count: 263 },
  { date: "2025-05-10", count: 285 }
]

const mockEvents = [
  { date: "2025-05-01", edits: 23, uploads: 31 },
  { date: "2025-05-02", edits: 28, uploads: 42 },
  { date: "2025-05-03", edits: 35, uploads: 48 },
  { date: "2025-05-04", edits: 42, uploads: 57 },
  { date: "2025-05-05", edits: 49, uploads: 63 },
  { date: "2025-05-06", edits: 55, uploads: 72 },
  { date: "2025-05-07", edits: 61, uploads: 80 },
  { date: "2025-05-08", edits: 68, uploads: 87 },
  { date: "2025-05-09", edits: 74, uploads: 95 },
  { date: "2025-05-10", edits: 82, uploads: 103 }
]

const mockTopUsers = [
  { userId: "user1", name: "أحمد محمد", edits: 42, uploads: 53 },
  { userId: "user2", name: "سارة عبدالله", edits: 38, uploads: 45 },
  { userId: "user3", name: "خالد العتيبي", edits: 35, uploads: 41 },
  { userId: "user4", name: "نورة الشمري", edits: 31, uploads: 37 },
  { userId: "user5", name: "فهد القحطاني", edits: 28, uploads: 34 }
]

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [pageViews, setPageViews] = useState(mockPageViews)
  const [events, setEvents] = useState(mockEvents)
  const [topUsers, setTopUsers] = useState(mockTopUsers)

  // Simulate loading data from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Calculate total metrics
  const totalPageViews = pageViews.reduce((sum, item) => sum + item.count, 0)
  const totalEdits = events.reduce((sum, item) => sum + item.edits, 0)
  const totalUploads = events.reduce((sum, item) => sum + item.uploads, 0)
  const conversionRate = Math.round((totalEdits / totalUploads) * 100)

  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsMetric
          title="إجمالي المشاهدات"
          value={totalPageViews}
          description="مشاهدات الصفحات في آخر 10 أيام"
          isLoading={isLoading}
        />
        <AnalyticsMetric
          title="عمليات التحميل"
          value={totalUploads}
          description="إجمالي الصور التي تم تحميلها"
          isLoading={isLoading}
        />
        <AnalyticsMetric
          title="عمليات التعديل"
          value={totalEdits}
          description="إجمالي الصور التي تم تعديلها"
          isLoading={isLoading}
        />
        <AnalyticsMetric
          title="معدل التحويل"
          value={`${conversionRate}%`}
          description="نسبة التعديلات إلى التحميلات"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات مفصلة</TabsTrigger>
          <TabsTrigger value="users">المستخدمين</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>نظرة عامة على الاستخدام</CardTitle>
              <CardDescription>
                إحصائيات استخدام التطبيق في آخر 10 أيام
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AnalyticsChart
                data={pageViews}
                isLoading={isLoading}
                xKey="date"
                yKey="count"
                label="المشاهدات"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تحليلات التعديلات والتحميلات</CardTitle>
              <CardDescription>
                مقارنة بين عمليات التحميل والتعديل
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AnalyticsChart
                data={events}
                isLoading={isLoading}
                xKey="date"
                yKey={["edits", "uploads"]}
                label={["التعديلات", "التحميلات"]}
                colors={["#10b981", "#3b82f6"]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>أكثر المستخدمين نشاطاً</CardTitle>
              <CardDescription>
                المستخدمين الأكثر نشاطاً في استخدام التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsTable
                data={topUsers}
                isLoading={isLoading}
                columns={[
                  { header: "المستخدم", accessorKey: "name" },
                  { header: "التعديلات", accessorKey: "edits" },
                  { header: "التحميلات", accessorKey: "uploads" }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>كيفية استخدام التحليلات</CardTitle>
          <CardDescription>
            نصائح لفهم بيانات التحليلات واستخدامها بفعالية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              تتيح لك صفحة التحليلات متابعة استخدام تطبيق أيسر ومعرفة كيفية
              تفاعل المستخدمين معه. يمكنك استخدام هذه البيانات لتحسين تجربة
              المستخدم وتطوير الميزات الأكثر استخداماً.
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>نظرة عامة:</strong> تعرض إحصائيات المشاهدات اليومية
                للتطبيق.
              </li>
              <li>
                <strong>تحليلات مفصلة:</strong> تقارن بين عمليات تحميل الصور
                وعمليات التعديل.
              </li>
              <li>
                <strong>المستخدمين:</strong> تعرض قائمة بأكثر المستخدمين نشاطاً
                في التطبيق.
              </li>
            </ul>
            <p>
              ملاحظة: البيانات المعروضة هنا هي بيانات توضيحية فقط. في الإصدار
              النهائي، سيتم عرض البيانات الفعلية من Google Analytics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
