"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { SelectEdit } from "@/db/schema"
import { Check, Clock, Download, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface HistoryItemProps {
  edit: SelectEdit
}

export function HistoryItem({ edit }: HistoryItemProps) {
  const [imageError, setImageError] = useState(false)

  // Format the date
  const formattedDate = new Date(edit.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

  // Status badge component
  const StatusBadge = () => {
    switch (edit.status) {
      case "completed":
        return (
          <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <Check className="mr-1 size-3" />
            مكتمل
          </div>
        )
      case "failed":
        return (
          <div className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <X className="mr-1 size-3" />
            فشل
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="mr-1 size-3" />
            جاري المعالجة
          </div>
        )
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-0">
        <div className="space-y-1">
          <p className="line-clamp-1 text-sm font-medium">
            {edit.userPromptOriginal}
          </p>
          <p className="text-muted-foreground text-xs">{formattedDate}</p>
        </div>
        <StatusBadge />
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {/* Original Image */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-center text-xs">
              الصورة الأصلية
            </p>
            <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-md">
              {edit.originalImageUrl && (
                <Image
                  src={edit.originalImageUrl}
                  alt="الصورة الأصلية"
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              )}
              {(!edit.originalImageUrl || imageError) && (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-xs">
                    الصورة غير متوفرة
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edited Image */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-center text-xs">
              الصورة المعدلة
            </p>
            <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-md">
              {edit.status === "completed" && edit.editedImageUrl ? (
                <Image
                  src={edit.editedImageUrl}
                  alt="الصورة المعدلة"
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : edit.status === "failed" ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-destructive text-xs">فشل التعديل</p>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground text-xs">
                    جاري المعالجة...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error message if failed */}
        {edit.status === "failed" && edit.errorMessage && (
          <p className="text-destructive mt-2 text-xs">{edit.errorMessage}</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {edit.status === "completed" && edit.editedImageUrl && (
          <a
            href={edit.editedImageUrl}
            download={edit.editedImageFilename || "edited-image.jpg"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" className="w-full">
              <Download className="mr-2 size-4" />
              تحميل الصورة المعدلة
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  )
}
