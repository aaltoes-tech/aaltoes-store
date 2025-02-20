"use client"

import { Button } from "@/components/ui/button"
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
  return (
    <div className="mb-8 space-y-4">
      <ProductSearch onSearchChange={onSearchChange} />
      <div className="flex flex-wrap items-center gap-4">
        <Select 
          value={currentType} 
          onValueChange={(value) => onTypeChange(value as ProductType | "all" | "")}
        >
          <SelectTrigger className="w-[180px]">
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
          <SelectTrigger className="w-[180px]">
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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSortChange("asc")}
            className="w-10 h-10"
          >
            <ArrowUp size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSortChange("desc")}
            className="w-10 h-10"
          >
            <ArrowDown size={16} />
          </Button>
        </div>

        <Button 
          variant="outline" 
          onClick={onReset}
          className="ml-auto"
        >
          Reset Filters
        </Button>
      </div>

    </div>
  )
} 