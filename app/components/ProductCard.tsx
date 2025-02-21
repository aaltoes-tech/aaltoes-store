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
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [showDetail, setShowDetail] = useState(false)
  const needsSize = PRODUCT_TYPE_CONFIG[product.type]?.hasSize

  // Show placeholder if no URL or invalid URL
  const imageUrl = product.image && 
    (product.image.startsWith('https') || product.image.startsWith('/')) 
    ? product.image 
    : '/placeholder-image.jpg'

  console.log(product)

  return (
    <>
      <div className="bg-background rounded-lg border shadow-sm overflow-hidden flex flex-col h-[380px]">
        <div 
          className="relative w-full aspect-square shrink-0 cursor-pointer"
          onClick={() => setShowDetail(true)}
        >
          {/* Loading Spinner */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
          
          <Image
            src={imageError ? '/placeholder-image.jpg' : imageUrl + "?img-height=1000&img-format=webp"}
            alt={product.name}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority
            onError={() => setImageError(true)}
            onLoadingComplete={() => setImageLoading(false)}
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