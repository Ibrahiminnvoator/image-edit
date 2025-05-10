"use client"

import { startImageEditProcessAction } from "@/actions/image-orchestration-actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useNotification } from "@/components/shared/notification-toast"
import { ALLOWED_IMAGE_FORMATS, MAX_IMAGE_UPLOAD_MB } from "@/lib/constants"
import { ImageUploadResult } from "@/types"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { trackEvent } from "@/lib/analytics"

interface EditFormProps {
  userId: string
}

export function EditForm({ userId }: EditFormProps) {
  const router = useRouter()
  const notification = useNotification()

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ALLOWED_IMAGE_FORMATS.includes(file.type as any)) {
      notification.error({
        title: "صيغة الملف غير مدعومة",
        description: "الصيغ المدعومة هي: JPEG, PNG, WebP"
      })
      return
    }

    // Validate file size
    if (file.size > MAX_IMAGE_UPLOAD_MB * 1024 * 1024) {
      notification.error({
        title: "حجم الملف كبير",
        description: `الحد الأقصى هو ${MAX_IMAGE_UPLOAD_MB} ميجابايت`
      })
      return
    }

    // Set selected file and create preview
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Track file selection event with Google Analytics
    trackEvent("IMAGE_SELECTED", {
      userId,
      fileType: file.type,
      fileSize: Math.round(file.size / 1024), // size in KB
      event_category: "user_interaction",
      event_label: "image_upload"
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      notification.warning({
        title: "لازم تختار صورة",
        description: "رجاءً اختر صورة للتعديل"
      })
      return
    }

    if (!prompt.trim()) {
      notification.warning({
        title: "وش تبي نسوي بالصورة؟",
        description: "لازم تكتب وش تبي نسوي بالصورة بالضبط"
      })
      return
    }

    try {
      setIsUploading(true)

      // Upload the image first
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("userId", userId)

      // Simulate the upload result for now - this will be replaced with actual upload
      const uploadResult: ImageUploadResult = {
        publicUrl: imagePreview!,
        path: `${userId}/${selectedFile.name}`,
        filename: selectedFile.name
      }

      // Start the image editing process
      setIsUploading(false)
      setIsProcessing(true)

      // Track form submission event with Google Analytics
      trackEvent("EDIT_FORM_SUBMITTED", {
        userId,
        promptLength: prompt.length,
        imageType: selectedFile.type,
        event_category: "user_interaction",
        event_label: "edit_submission",
        image_size_kb: Math.round(selectedFile.size / 1024),
        timestamp: new Date().toISOString()
      })

      const result = await startImageEditProcessAction(
        uploadResult.publicUrl,
        uploadResult.filename,
        prompt
      )

      if (!result.isSuccess) {
        throw new Error(result.message)
      }

      // Show success notification
      notification.success({
        title: "تم بدء عملية التعديل",
        description: "جاري تعديل الصورة، راح نعلمك لما تخلص"
      })

      // Redirect to job status page or history page
      router.push(`/history`)
    } catch (error) {
      console.error("Error starting edit process:", error)
      notification.error({
        title: "حدث خطأ",
        description:
          error instanceof Error ? error.message : "فشل في بدء عملية التعديل"
      })
    } finally {
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Image Upload Area */}
      <div className="space-y-2">
        <Label
          htmlFor="image-upload"
          className="text-base font-medium sm:text-lg"
        >
          الصورة
        </Label>

        {imagePreview ? (
          <div className="border-primary/20 relative mt-2 rounded-lg border-2 border-dashed p-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-md sm:aspect-video">
              <Image
                src={imagePreview}
                alt="صورة للتعديل"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 h-8 text-xs sm:h-9 sm:text-sm"
              onClick={() => {
                setSelectedFile(null)
                setImagePreview(null)
              }}
            >
              اختر صورة أخرى
            </Button>
          </div>
        ) : (
          <div className="border-primary/20 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 sm:p-12">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <Upload className="text-muted-foreground size-6 sm:size-8" />
              <div className="space-y-1">
                <p className="text-xs font-medium sm:text-sm">
                  اضغط هنا لاختيار صورة أو اسحبها وأفلتها هنا
                </p>
                <p className="text-muted-foreground text-xs">
                  JPG, PNG, WebP حتى {MAX_IMAGE_UPLOAD_MB} ميجابايت
                </p>
              </div>
              <Input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 h-8 text-xs sm:h-9 sm:text-sm"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                اختر صورة
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-base font-medium sm:text-lg">
          وش تبي نسوي في الصورة؟
        </Label>
        <Textarea
          id="prompt"
          placeholder="مثال: عدل الصورة وخليها بطابع كرتوني، أو غير الخلفية إلى شاطئ..."
          className="min-h-[100px] resize-y text-sm sm:min-h-[120px] sm:text-base"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <p className="text-muted-foreground text-xs">
          اكتب بالتفصيل وش تبي نسوي بالصورة بالضبط. كلما كان وصفك أدق، كانت
          النتيجة أفضل.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="mt-2 h-10 w-full text-sm sm:mt-4 sm:h-11 sm:text-base"
        disabled={
          isUploading || isProcessing || !selectedFile || !prompt.trim()
        }
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 size-3 animate-spin sm:size-4" />
            جاري رفع الصورة...
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="mr-2 size-3 animate-spin sm:size-4" />
            جاري بدء عملية التعديل...
          </>
        ) : (
          "بدء التعديل"
        )}
      </Button>
    </form>
  )
}
