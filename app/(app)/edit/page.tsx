/*
 * Edit page for AisarEdit - allows users to upload and edit images
 */

import { EditForm } from "./_components/edit-form"
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "أَيْسَر | AisarEdit - تعديل صورة",
  description: "حمّل صورة وعدلها باستخدام الذكاء الاصطناعي"
}

export default async function EditPage() {
  // Check if user is authenticated
  const { userId } = await auth()
  if (!userId) {
    redirect("/login")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">تعديل صورة</h1>
        <p className="text-muted-foreground mt-2">
          حمّل صورتك وقول لنا وش تبي نسوي فيها بالضبط
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <EditForm userId={userId} />
      </div>
    </div>
  )
}
