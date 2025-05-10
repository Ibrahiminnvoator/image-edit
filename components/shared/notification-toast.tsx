"use client"

import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ReactNode } from "react"

type NotificationVariant = "default" | "success" | "error" | "warning" | "info"

interface NotificationOptions {
  title?: string
  description?: string
  variant?: NotificationVariant
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

export function useNotification() {
  const { toast } = useToast()

  const showNotification = ({
    title,
    description,
    variant = "default",
    action,
    duration = 5000
  }: NotificationOptions) => {
    // Map variant to appropriate styling
    const variantStyles: Record<NotificationVariant, { className?: string }> = {
      default: {},
      success: {
        className:
          "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50"
      },
      error: {
        className:
          "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50"
      },
      warning: {
        className:
          "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/50"
      },
      info: {
        className:
          "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50"
      }
    }

    toast({
      title,
      description,
      ...variantStyles[variant],
      duration,
      action: action ? (
        <ToastAction altText={action.label} onClick={action.onClick}>
          {action.label}
        </ToastAction>
      ) : undefined
    })
  }

  // Convenience methods for different notification types
  const success = (options: Omit<NotificationOptions, "variant">) =>
    showNotification({ ...options, variant: "success" })

  const error = (options: Omit<NotificationOptions, "variant">) =>
    showNotification({ ...options, variant: "error" })

  const warning = (options: Omit<NotificationOptions, "variant">) =>
    showNotification({ ...options, variant: "warning" })

  const info = (options: Omit<NotificationOptions, "variant">) =>
    showNotification({ ...options, variant: "info" })

  return {
    showNotification,
    success,
    error,
    warning,
    info
  }
}
