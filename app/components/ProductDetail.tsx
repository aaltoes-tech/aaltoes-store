"use client"

import {  Size, PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductButton } from "./ProductButton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductWithDetails } from "@/app/types"
import { Badge } from "@/components/ui/badge"

interface ProductDetailProps {
  product: ProductWithDetails
  isOpen: boolean
  onClose: () => void
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<Size>()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const needsSize = PRODUCT_TYPE_CONFIG[product.type as keyof typeof PRODUCT_TYPE_CONFIG]?.hasSize

  const imageUrl = product.image && 
    (product.image.startsWith('https') || product.image.startsWith('/')) 
    ? product.image 
    : '/placeholder-image.jpg'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full aspect-square relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}
            <Image
              src={imageError ? '/placeholder-image.jpg' : imageUrl + "?img-height=1200&img-format=webp"}
              alt={product.name}
              key={product.id}
              fill
              className={`object-contain rounded-md transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-height: 1000px) 100vw, 50vw"
              priority
              onError={() => setImageError(true)}
              onLoadingComplete={() => setImageLoading(false)}
            />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Product Details
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {PRODUCT_TYPE_CONFIG[product.type].label}
                </Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {product.description}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-3xl font-bold">${product.price}</p>
              
              {needsSize && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Size</label>
                  <Select
                    value={selectedSize}
                    onValueChange={(value: Size) => setSelectedSize(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <ProductButton 
                className="w-full" 
                productId={product.id}
                size={needsSize ? selectedSize : undefined}
                disabled={needsSize && !selectedSize}
                onSuccess={onClose}
                closeOnSuccess={false}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 