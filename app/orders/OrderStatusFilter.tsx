"use client"

import { cn } from "@/lib/utils"

const statuses = ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"]

interface OrderStatusFilterProps {
  selectedStatuses: string[]
  onChange: (statuses: string[]) => void
}

export function OrderStatusFilter({ selectedStatuses, onChange }: OrderStatusFilterProps) {
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onChange(selectedStatuses.filter(s => s !== status))
    } else {
      onChange([...selectedStatuses, status])
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => toggleStatus(status)}
          className={cn(
            "px-3 py-1 rounded-full text-sm transition-colors",
            selectedStatuses.includes(status)
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          {status.toLowerCase()}
        </button>
      ))}
    </div>
  )
} 