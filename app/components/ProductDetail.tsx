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
      <DialogContent className="sm:max-w-[1200px] h-[85vh] sm:h-auto sm:max-h-[95vh] p-0 rounded-lg flex flex-col [&>button]:!ring-0 [&>button]:!ring-offset-0">
        {/* Desktop/Landscape Header */}
        <div className="hidden landscape:block sm:block px-6 pt-6">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-3">
              <DialogTitle className="text-xl landscape:text-2xl md:text-3xl lg:text-4xl font-bold">
                {product.name}
              </DialogTitle>
              <Badge className="text-base landscape:text-lg md:text-lg lg:text-xl px-3 py-1 bg-foreground text-background">
                {PRODUCT_TYPE_CONFIG[product.type].label}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 flex flex-col landscape:flex-row">
          {/* Image Container */}
          <div className="relative aspect-square landscape:w-1/2 landscape:h-[85vh] flex-shrink-0 cursor-pointer landscape:cursor-default md:cursor-default bg-muted/5">
            <Image 
              src={imageError ? '/placeholder-image.jpg' : imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
              onError={() => setImageError(true)}
            />
            <div className="absolute bottom-4 left-0 right-0 text-center landscape:hidden md:hidden">
              <p className="text-sm text-muted-foreground">Tap image to close</p>
            </div>
          </div>

          {/* Details - Scrollable and Centered */}
          <div className="landscape:w-1/2 flex-1 overflow-y-auto">
            <div className="p-6 landscape:p-4 min-h-full landscape:flex landscape:flex-col landscape:justify-center">
              {/* Mobile Portrait Title */}
              <div className="portrait:block hidden sm:hidden mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold">{product.name}</h2>
                  <Badge className="text-base sm:text-lg px-3 py-1 bg-foreground text-background">
                    {PRODUCT_TYPE_CONFIG[product.type].label}
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6 landscape:space-y-8">
                <div className="space-y-4">
                  <p className="text-base landscape:text-lg sm:text-lg text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <h3 className="text-2xl landscape:text-3xl sm:text-3xl font-bold">
                    {product.price} €
                  </h3>
                </div>

                {/* Size Selection */}
                {needsSize && (
                  <div className="space-y-3">
                    <label className="text-base landscape:text-lg sm:text-lg font-medium">
                      Select Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          onClick={() => setSelectedSize(size)}
                          className="px-4 h-10 landscape:h-12 text-base landscape:text-lg"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="mt-6">
                  {!product.limited ? (
                    <ProductButton
                      productId={product.id}
                      size={selectedSize}
                      disabled={needsSize && !selectedSize}
                      onSuccess={onClose}
                      closeOnSuccess={true}
                      className="w-full text-lg landscape:text-xl py-6"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground mt-4 w-full text-sm md:text-base !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 hover:!ring-0 hover:!ring-offset-0">
                      This item is limited edition
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 