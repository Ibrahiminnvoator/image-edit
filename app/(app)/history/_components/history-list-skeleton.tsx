/*
 * Skeleton loader for the history list
 */

import { Skeleton } from "@/components/ui/skeleton"

export function HistoryListSkeleton() {
  // Create an array of 3 items for the skeleton
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {skeletonItems.map(item => (
        <div key={item} className="space-y-4 rounded-lg border p-4">
          {/* Image skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full rounded-md" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Button skeleton */}
          <div className="pt-2">
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
