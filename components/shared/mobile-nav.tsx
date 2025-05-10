"use client"

import { cn } from "@/lib/utils"
import { Home, Image, History, BarChart, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      name: "لوحة التحكم",
      href: "/dashboard",
      icon: Home
    },
    {
      name: "تعديل صورة",
      href: "/edit",
      icon: Image
    },
    {
      name: "سجل التعديلات",
      href: "/history",
      icon: History
    },
    {
      name: "التحليلات",
      href: "/analytics",
      icon: BarChart
    }
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">فتح القائمة</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] pt-10 sm:w-[350px]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="text-primary text-2xl font-bold">أَيْسَر</div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="size-5" />
              <span className="sr-only">إغلاق القائمة</span>
            </Button>
          </div>

          <nav className="flex flex-col gap-4">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md p-3 text-base transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon className="size-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t pt-4">
            <div className="text-muted-foreground px-3 text-sm">
              تعديل الصور بالذكاء الاصطناعي
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
