"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash } from "@geist-ui/icons"
import { useToast } from "@/hooks/use-toast"
import { CartItem } from "@prisma/client"
import { QuantityInput } from "@/app/components/ui/quantity-input"
import { ProductType, PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ProductStatus, Size } from "@prisma/client"

interface CartItemsProps {
  items: (CartItem & {
    product: {
      id: string
      name: string
      price: number
      image: string
      type: ProductType
      status: ProductStatus
    }
    size: Size | null
  })[]
}

export function CartItems({ items: initialItems }: CartItemsProps) {
  const [items, setItems] = useState(initialItems)
  const { toast } = useToast()
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const hasRemovedProducts = items.some(item => item.product.status === 'removed')

  const getImageUrl = (url: string) => {
    return url && (url.startsWith('https') || url.startsWith('/'))
      ? url + "?img-width=100&img-format=webp"
      : '/placeholder-image.jpg'
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1 || newQuantity > 10) return
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      if (!res.ok) throw new Error()
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to update quantity"
      })
    }
  }

  async function handleDelete(itemId: string) {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems(items.filter(item => item.id !== itemId))
      toast({ description: "Item removed from cart" })
    } catch {
      toast({ 
        variant: "destructive", 
        description: "Failed to remove item" 
      })
    }
  }

  const handleCheckout = async () => {
    if (hasRemovedProducts) {
      toast({
        variant: "destructive",
        title: "Cannot proceed to checkout",
        description: "Please remove unavailable items from your cart first."
      })
      return
    }

    router.push('/order')
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Your cart is empty</p>
      </div>
    )
  }

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="flex-1 max-h-[400px] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0  bg-background z-10">
            <tr className="text-sm text-muted-foreground border-b">
              <th className="pb-4 font-medium text-center w-20 py-6 ">Product</th>
              <th className="pb-4 font-medium text-left w-60 px-4 py-6 ">Name</th>
              <th className="pb-4 font-medium text-center w-20 py-6 ">Size</th>
              <th className="pb-4 font-medium text-center w-28 py-6">Quantity</th>
              <th className="pb-4 font-medium text-center w-20 py-6">Price</th>
              <th className="pb-4 font-medium text-center w-16 py-6å"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-4 px-2 text-center">
                  <div className="relative w-16 aspect-square mx-auto">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      </div>
                    )}
                    <Image
                      src={imageError ? '/placeholder-image.jpg' : getImageUrl(item.product.image)}
                      alt={item.product.name}
                      key={`${item.product.id}-${Date.now()}`}
                      fill
                      className={`object-contain rounded-md transition-opacity duration-300 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      sizes="64px"
                      priority
                      onError={() => setImageError(true)}
                      onLoadingComplete={() => setImageLoading(false)}
                    />
                  </div>
                </td>
                <td className="py-4 px-4 text-left">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <div className="flex gap-2 mt-2">
                      {item.size && (
                        <Badge variant="outline" className="text-xs">
                          {item.product.type}
                        </Badge>
                      )}
                      {item.product.status === 'removed' && (
                        <Badge variant="destructive" className="text-xs">
                          Not available
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  {PRODUCT_TYPE_CONFIG[item.product.type].hasSize ? (
                    <Badge variant="secondary" className="text-xs">
                      {item.size}
                    </Badge>
                  ) : null}
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex justify-center">
                    <QuantityInput
                      value={item.quantity}
                      onChange={(value: number) => updateQuantity(item.id, value)}
                    />
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-medium">
                  {item.product.price * item.quantity} €
                </td>
                <td className="py-4 px-4 text-center">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-muted/50 shrink-0">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">{total.toFixed(2)} €</p>
            </div>
          </div>
          
          <Button 
            className="w-full sm:w-auto sm:min-w-[200px] ml-auto block" 
            size="lg"
            onClick={handleCheckout}
            disabled={hasRemovedProducts}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
} 