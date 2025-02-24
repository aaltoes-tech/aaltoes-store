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
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const needsSize = PRODUCT_TYPE_CONFIG[product.type]?.hasSize

  // Show placeholder if no URL or invalid URL
  const imageUrl = product.image && 
    (product.image.startsWith('https') || product.image.startsWith('/')) 
    ? product.image 
    : '/placeholder-image.jpg'

  return (
    <>
      <div className="group bg-background rounded-lg border shadow-sm overflow-hidden flex flex-col">
        <div 
          className="relative aspect-square w-full cursor-pointer overflow-hidden"
          onClick={() => setShowDetail(true)}
        >
          {/* Loading Spinner */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
          
          <Image
            src={imageError ? '/placeholder-image.jpg' : imageUrl + "?img-height=800&img-format=webp"}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } group-hover:scale-105`}
            sizes="(max-width: 640px) 50vw, 
                   (max-width: 1024px) 33vw,
                   25vw"
            quality={90}
            priority={true}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoading(false)}
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{product.name}</h3>
          <p className="mt-2 text-lg font-bold">{product.price} €</p>
        
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

          <div className="mt-auto pt-4">
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setShowDetail(true)}
            >
              View Details
            </Button>
          </div>
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