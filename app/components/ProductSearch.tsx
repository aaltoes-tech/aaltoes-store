"use client"

import { Input } from "@/components/ui/input"
import { Search } from "@geist-ui/icons"

interface ProductSearchProps {
  value?: string
  onSearchChange: (value: string) => void
}

export function ProductSearch({ value = "", onSearchChange }: ProductSearchProps) {
  return (
    <div className="relative flex items-center w-full">
      <Search 
        size={16} 
        className="absolute left-3 text-muted-foreground pointer-events-none" 
      />
      <Input
        value={value}
        placeholder="Search products..."
        className="pl-9 w-full"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
} 