"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductType, Size, PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import { ArrowUp, ArrowDown } from "@geist-ui/icons"
import { ProductSearch } from "./ProductSearch"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ProductFiltersProps {
  onSearchChange: (value: string) => void
  onTypeChange: (value: ProductType | "all" | "") => void
  onSizeChange: (value: Size | "all" | "") => void
  onSortChange: (value: "asc" | "desc" | "") => void
  onReset: () => void
  currentType: string
  currentSize: string
}

export function ProductFilters({
  onSearchChange,
  onTypeChange,
  onSizeChange,
  onSortChange,
  onReset,
  currentType,
  currentSize,
}: ProductFiltersProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleReset = () => {
    setSearchValue("")
    onReset()
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange(value)
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="w-full">
        <ProductSearch 
          value={searchValue}
          onSearchChange={handleSearchChange} 
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Select 
          value={currentType} 
          onValueChange={(value) => onTypeChange(value as ProductType | "all" | "")}
        >
          <SelectTrigger className="w-[140px] sm:w-[180px]">
            <SelectValue placeholder="Product Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(PRODUCT_TYPE_CONFIG).map(([type, config]) => (
              <SelectItem key={type} value={type}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={currentSize} 
          onValueChange={(value) => onSizeChange(value as Size | "all" | "")}
        >
          <SelectTrigger className="w-[120px] sm:w-[180px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {Object.values(Size).map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSortChange("asc")}
            className="w-8 h-8 sm:w-10 sm:h-10"
          >
            <ArrowUp size={14} className="sm:size-16" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSortChange("desc")}
            className="w-8 h-8 sm:w-10 sm:h-10"
          >
            <ArrowDown size={14} className="sm:size-16" />
          </Button>

          <Button
            variant="outline" 
            onClick={handleReset}
            className="text-sm sm:text-base h-8 sm:h-10"
            size="sm"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
} 