"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductButton } from "./ProductButton"
import { PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import { ProductWithDetails } from "@/app/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { Size } from "@/app/lib/constants"

interface ProductDetailProps {
  product: ProductWithDetails
  isOpen: boolean
  onClose: () => void
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<Size | "">("")
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const needsSize = PRODUCT_TYPE_CONFIG[product.type]?.hasSize

  const imageUrl = product.image && 
    (product.image.startsWith('https') || product.image.startsWith('/')) 
      ? product.image 
      : '/placeholder-image.jpg'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <DialogTitle className="text-2xl sm:text-3xl font-bold">{product.name}</DialogTitle>
            <Badge className="text-base sm:text-lg px-3 py-1 bg-foreground text-background hover:bg-foreground/90">
              {PRODUCT_TYPE_CONFIG[product.type].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex flex-col sm:grid sm:grid-cols-[1.2fr,0.8fr] gap-4 sm:gap-8">
          {/* Image Section - Made Larger */}
          <div className="relative aspect-square overflow-hidden rounded-md bg-muted/5">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}
            <Image
              src={imageError ? '/placeholder-image.jpg' : imageUrl}
              alt={product.name}
              fill
              className={`
                object-cover 
                transition-opacity duration-300
                ${imageLoading ? 'opacity-0' : 'opacity-100'}
              `}
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
              onError={() => setImageError(true)}
              onLoadingComplete={() => setImageLoading(false)}
            />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold">
                {product.price} €
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {needsSize && (
              <div className="space-y-3">
                <label className="text-lg font-medium">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="px-4 py-2 h-auto text-base"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-6">
              <ProductButton
                productId={product.id}
                size={selectedSize}
                disabled={needsSize && !selectedSize}
                onSuccess={onClose}
                closeOnSuccess={true}
                className="w-full text-lg py-6"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 