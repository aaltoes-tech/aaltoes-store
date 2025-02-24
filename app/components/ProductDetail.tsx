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
  const needsSize = PRODUCT_TYPE_CONFIG[product.type]?.hasSize

  const imageUrl = product.image && 
    (product.image.startsWith('https') || product.image.startsWith('/')) 
      ? product.image 
      : '/placeholder-image.jpg'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] h-[85vh] sm:h-auto sm:max-h-[90vh] p-0 rounded-lg flex flex-col">
        {/* Desktop header */}
        <div className="hidden sm:block p-4 sm:p-6">
          <DialogHeader className="space-y-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <DialogTitle className="text-2xl sm:text-3xl font-bold">{product.name}</DialogTitle>
              <Badge className="text-base sm:text-lg px-3 py-1 bg-foreground text-background hover:bg-foreground/90">
                {PRODUCT_TYPE_CONFIG[product.type].label}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        {/* Main content container */}
        <div className="flex-1 min-h-0 flex flex-col sm:grid sm:grid-cols-[1.2fr,0.8fr]">
          {/* Fixed Image Section */}
          <div className="relative aspect-square flex-shrink-0 cursor-pointer md:cursor-default"
            onClick={() => onClose()}>
            <Image
              src={imageError ? '/placeholder-image.jpg' : imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
              onError={() => setImageError(true)}
            />
            <div className="absolute bottom-4 left-0 right-0 text-center md:hidden">
              <p className="text-sm text-muted-foreground py-2">
                Tap image to close
              </p>
            </div>
          </div>

          {/* Scrollable Content Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-6">
              {/* Mobile Title */}
              <div className="sm:hidden">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <Badge className="text-sm px-2 py-0.5 bg-foreground text-background">
                    {PRODUCT_TYPE_CONFIG[product.type].label}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col space-y-4 sm:space-y-6 mt-3 sm:mt-4">
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {product.price} €
                  </h3>
                </div>

                {needsSize && (
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-base sm:text-lg font-medium">Select Size</label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          onClick={() => setSelectedSize(size)}
                          className="px-3 sm:px-4 h-8 sm:h-auto text-sm sm:text-base"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <ProductButton
                    productId={product.id}
                    size={selectedSize}
                    disabled={needsSize && !selectedSize}
                    onSuccess={onClose}
                    closeOnSuccess={true}
                    className="w-full text-base sm:text-lg py-4 sm:py-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 