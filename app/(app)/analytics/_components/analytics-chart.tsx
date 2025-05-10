"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from "recharts"

interface AnalyticsChartProps {
  data: any[]
  isLoading: boolean
  xKey: string
  yKey: string | string[]
  label: string | string[]
  colors?: string[]
}

export function AnalyticsChart({
  data,
  isLoading,
  xKey,
  yKey,
  label,
  colors = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"]
}: AnalyticsChartProps) {
  // Format dates for better display
  const formattedData = data.map(item => ({
    ...item,
    [xKey]: formatDate(item[xKey])
  }))

  // Helper function to format dates
  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Determine if we're showing multiple data series
  const isMultiSeries = Array.isArray(yKey)

  // For single data series, use a bar chart
  if (!isMultiSeries) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip
            formatter={value => [
              `${value}`,
              typeof label === "string" ? label : ""
            ]}
            labelFormatter={value => `التاريخ: ${value}`}
          />
          <Bar
            dataKey={yKey as string}
            fill={colors[0]}
            name={typeof label === "string" ? label : ""}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // For multiple data series, use a line chart
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip
          formatter={(value, name, props) => {
            const index = (yKey as string[]).findIndex(
              key => key === props.dataKey
            )
            return [`${value}`, Array.isArray(label) ? label[index] : name]
          }}
          labelFormatter={value => `التاريخ: ${value}`}
        />
        <Legend />
        {(yKey as string[]).map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            name={Array.isArray(label) ? label[index] : key}
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
