"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { ProductStatus, ProductType } from "@prisma/client"
import Image from "next/image"
import { OrderStatusFilter } from "./OrderStatusFilter"
import { truncateId } from "@/app/utils/utils"
import { Copy, Mail } from "@geist-ui/icons"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { cancelOrder as cancelOrderAction } from "@/app/admin/orders/actions"
import { getOrders } from "./actions"

interface OrderItem {
  id: string
  quantity: number
  total: number
  size: string | null
  product: {
    id: string
    name: string
    price: number
    image: string
    type: ProductType
    status: ProductStatus
  }
}

interface Order {
  id: string
  status: string
  createdAt: Date
  phone_number?: string
  comment?: string
  total: number
  items: OrderItem[]
}

interface OrderListProps {
  initialOrders: Order[]
}

export function OrderList({ initialOrders }: OrderListProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [loading, setLoading] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "PENDING",
    "PROCESSING"
  ])
  const { toast } = useToast()
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const refreshOrders = async () => {
    const updatedOrders = await getOrders()
    setOrders(updatedOrders)
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      setLoading(true)
      const result = await cancelOrderAction(orderId, 'Order was cancelled by user')
      if (result.success) {
        toast({
          description: "Order cancelled successfully"
        })
        // Refresh orders without page refresh
        await refreshOrders()
      } else {
        toast({
          variant: "destructive",
          description: "Failed to cancel order"
        })
      }
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to cancel order"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = selectedStatuses.length === 0
    ? []
    : orders.filter(order => selectedStatuses.includes(order.status))

  const getImageUrl = (productImage: string) => {
    if (imageErrors[productImage]) {
      return '/placeholder-image.jpg'
    }
    
    // Check if URL is valid
    if (!productImage || !(productImage.startsWith('http') || productImage.startsWith('/'))) {
      return '/placeholder-image.jpg'
    }

    return productImage + "?img-width=100&img-format=webp"
  }

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      toast({
        description: "Order ID copied to clipboard"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to copy order ID"
      })
    }
  }

  const getContactEmailUrl = (orderId: string) => {
    const subject = `Aaltoes Shop: Support Request for Order #${orderId}`
    const email = "board@aaltoes.com"
    return `mailto:${email}?subject=${encodeURIComponent(subject)}`
  }

  return (
    <div className="space-y-8">
      <OrderStatusFilter
        selectedStatuses={selectedStatuses}
        onChange={setSelectedStatuses}
      />
      
      {filteredOrders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {selectedStatuses.length === 0 
            ? "Select a status to filter orders"
            : "No orders found with selected statuses"
          }
        </p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="border rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Placed on {formatDate(order.createdAt)}
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    Order #{truncateId(order.id)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopyId(order.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="capitalize">
                  {order.status.toLowerCase()}
                </Badge>
                {order.status === "PENDING" && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    disabled={loading}
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                      onError={() => {
                        setImageErrors(prev => ({
                          ...prev,
                          [item.product.image]: true
                        }))
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                      {item.size && ` • ${item.size}`}
                    </p>
                  </div>
                  <p className="font-medium">{item.total.toFixed(2)} €</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <a
                href={getContactEmailUrl(order.id)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-2"
                )}
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </a>
              {order.status !== "CANCELLED" ? (    
                <div className="text-right">
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {order.total.toFixed(2)} €
                  </p>
                </div>
              ) : (
                <div className="text-right">
                  <p className="text-sm font-medium">{order.comment}</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
} 