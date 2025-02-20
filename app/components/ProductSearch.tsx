"use client"

import { Input } from "@/components/ui/input"
import { Search } from "@geist-ui/icons"

interface ProductSearchProps {
  onSearchChange: (value: string) => void
}

export function ProductSearch({ onSearchChange }: ProductSearchProps) {
  return (
    <div className="relative flex items-center">
      <Search 
        size={16} 
        className="absolute left-3 text-muted-foreground pointer-events-none" 
      />
      <Input
        placeholder="Search products..."
        className="pl-9"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
} 