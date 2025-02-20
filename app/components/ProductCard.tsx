"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductDetail } from "./ProductDetail"
import { PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import { Product } from "@prisma/client"
import { ProductType, Size } from "@/app/lib/constants"

type ProductWithDetails = Omit<Product, 'type' | 'sizes'> & {
  type: ProductType;
  sizes: Size[];
}

interface ProductCardProps {
  product: ProductWithDetails
}

export function ProductCard({ product }: ProductCardProps) {
  const [showDetail, setShowDetail] = useState(false)
  const needsSize = PRODUCT_TYPE_CONFIG[product.type]?.hasSize

  return (
    <>
      <div className="bg-background rounded-lg border shadow-sm overflow-hidden flex flex-col h-[380px]">
        <div 
          className="relative w-full h-48 shrink-0 cursor-pointer"
          style={{ minHeight: '12rem' }}
          onClick={() => setShowDetail(true)}
        >
          <Image
            src={'/placeholder-image.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        
          <div className="flex flex-wrap gap-1 mt-2">
            {needsSize ? (
              product.sizes.map((size) => (
                <Badge 
                  key={size} 
                  variant="secondary"
                  className="text-xs"
                >
                  {size}
                </Badge>
              ))
            ) : null}
          </div>
          <div className="flex-1" />
          <Button 
            variant="outline"
            onClick={() => setShowDetail(true)}
          >
            View Details
          </Button>
        </div>
      </div>

      <ProductDetail 
        product={product}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </>
  )
} 