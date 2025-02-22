"use client"

import { Product } from "@prisma/client"
import { ProductType, Size } from "@/app/lib/constants"
import { useState, useMemo } from "react"
import { ProductFilters } from "./ProductFilters"
import { ProductCard } from "./ProductCard"

type ProductWithDetails = Omit<Product, 'type' | 'sizes'> & {
  type: ProductType;
  sizes: Size[];
}

interface ProductGridProps {
  products: ProductWithDetails[]
}

type FilterValue = ProductType | "all" | ""
type SizeFilterValue = Size | "all" | ""

export function ProductGrid({ products }: ProductGridProps) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<FilterValue>("all")
  const [sizeFilter, setSizeFilter] = useState<SizeFilterValue>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("")

  const resetFilters = () => {
    setSearch("")
    setTypeFilter("all")
    setSizeFilter("all")
    setSortOrder("")
  }

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = 
          search === "" ||
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())

        const matchesType = 
          typeFilter === "" || 
          typeFilter === "all" || 
          product.type === typeFilter

        const matchesSize = 
          sizeFilter === "" || 
          sizeFilter === "all" || 
          product.sizes.includes(sizeFilter)

        return matchesSearch && matchesType && matchesSize
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.price - b.price
        }
        if (sortOrder === "desc") {
          return b.price - a.price
        }
        return 0
      })
  }, [products, search, typeFilter, sizeFilter, sortOrder])

  return (
    <div className="space-y-6">
      <ProductFilters
        onSearchChange={setSearch}
        onTypeChange={setTypeFilter}
        onSizeChange={setSizeFilter}
        onSortChange={setSortOrder}
        onReset={resetFilters}
        currentType={typeFilter}
        currentSize={sizeFilter}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-muted-foreground">
            No products found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
} 