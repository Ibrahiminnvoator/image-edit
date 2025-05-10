"use client"

import { SelectEdit } from "@/db/schema"
import { HistoryItem } from "./history-item"

interface HistoryListProps {
  edits: SelectEdit[]
}

export function HistoryList({ edits }: HistoryListProps) {
  // Sort edits by creation date (newest first)
  const sortedEdits = [...edits].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedEdits.map(edit => (
        <HistoryItem key={edit.id} edit={edit} />
      ))}
    </div>
  )
}
