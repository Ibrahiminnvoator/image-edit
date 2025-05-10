/**
 * Type declarations for Recharts library
 */

declare module "recharts" {
  import * as React from "react"

  export interface BarChartProps {
    width?: number
    height?: number
    data?: any[]
    layout?: "horizontal" | "vertical"
    margin?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
    barCategoryGap?: number | string
    barGap?: number | string
    children?: React.ReactNode
  }

  export interface LineChartProps {
    width?: number
    height?: number
    data?: any[]
    margin?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
    children?: React.ReactNode
  }

  export interface BarProps {
    dataKey: string
    fill?: string
    name?: string
    stackId?: string
    barSize?: number
    maxBarSize?: number
    minPointSize?: number
  }

  export interface LineProps {
    type?:
      | "basis"
      | "basisClosed"
      | "basisOpen"
      | "linear"
      | "linearClosed"
      | "natural"
      | "monotoneX"
      | "monotoneY"
      | "monotone"
      | "step"
      | "stepBefore"
      | "stepAfter"
    dataKey: string
    stroke?: string
    strokeWidth?: number
    name?: string
    dot?:
      | boolean
      | React.ReactNode
      | React.ReactElement
      | ((props: any) => React.ReactNode)
    activeDot?:
      | boolean
      | React.ReactNode
      | React.ReactElement
      | ((props: any) => React.ReactNode)
  }

  export interface XAxisProps {
    dataKey?: string
    hide?: boolean
    label?: string | React.ReactElement
    tick?: boolean | React.ReactElement | ((props: any) => React.ReactNode)
    tickLine?: boolean | React.ReactElement | ((props: any) => React.ReactNode)
    axisLine?: boolean | React.ReactElement | ((props: any) => React.ReactNode)
    domain?: [number | string, number | string]
  }

  export interface YAxisProps {
    dataKey?: string
    hide?: boolean
    label?: string | React.ReactElement
    tick?: boolean | React.ReactElement | ((props: any) => React.ReactNode)
    tickLine?: boolean | React.ReactElement | ((props: any) => React.ReactNode)
    axisLine?: boolean | React.ReactElement | ((props: any) => React.ReactNode)
    domain?: [number | string, number | string]
  }

  export interface CartesianGridProps {
    horizontal?: boolean
    vertical?: boolean
    horizontalPoints?: number[]
    verticalPoints?: number[]
    strokeDasharray?: string
  }

  export interface TooltipProps {
    formatter?: (value: any, name: string, props: any) => React.ReactNode
    labelFormatter?: (value: any) => React.ReactNode
    cursor?: boolean | React.ReactElement | ((props: any) => React.ReactNode)
    content?: React.ReactElement | ((props: any) => React.ReactNode)
  }

  export interface LegendProps {
    align?: "left" | "center" | "right"
    verticalAlign?: "top" | "middle" | "bottom"
    layout?: "horizontal" | "vertical"
    iconType?:
      | "line"
      | "square"
      | "rect"
      | "circle"
      | "cross"
      | "diamond"
      | "star"
      | "triangle"
      | "wye"
    payload?: Array<{
      value: string
      type: string
      id: string
      color: string
    }>
  }

  export interface ResponsiveContainerProps {
    width?: number | string
    height?: number | string
    minWidth?: number | string
    minHeight?: number | string
    aspect?: number
    children?: React.ReactNode
  }

  export class BarChart extends React.Component<BarChartProps> {}
  export class LineChart extends React.Component<LineChartProps> {}
  export class Bar extends React.Component<BarProps> {}
  export class Line extends React.Component<LineProps> {}
  export class XAxis extends React.Component<XAxisProps> {}
  export class YAxis extends React.Component<YAxisProps> {}
  export class CartesianGrid extends React.Component<CartesianGridProps> {}
  export class Tooltip extends React.Component<TooltipProps> {}
  export class Legend extends React.Component<LegendProps> {}
  export class ResponsiveContainer extends React.Component<ResponsiveContainerProps> {}
}
