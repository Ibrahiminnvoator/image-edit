"use client"

import { cn } from "@/lib/utils"
import { Home, Image, History, BarChart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

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
    <aside className="bg-background flex h-screen w-[250px] flex-col border-e p-4">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="text-primary text-2xl font-bold">أَيْسَر</div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t pt-4">
        <div className="text-muted-foreground px-3 text-xs">
          تعديل الصور بالذكاء الاصطناعي
        </div>
      </div>
    </aside>
  )
}
