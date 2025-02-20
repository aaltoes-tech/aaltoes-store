"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Product } from "@prisma/client"
import Image from "next/image"
import { OrderStatusFilter } from "./OrderStatusFilter"

interface OrderItem {
  id: string
  quantity: number
  total: number
  size: string | null
  product: Product
}

interface Order {
  id: string
  status: string
  createdAt: Date
  phone_number: string
  comment: string
  total: number
  items: OrderItem[]
}


export function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [loading, setLoading] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "PENDING",
    "PROCESSING"
  ])
  const { toast } = useToast()

  async function cancelOrder(orderId: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      })

      if (!res.ok) throw new Error()

      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'CANCELLED' }
          : order
      ))

      toast({
        description: "Order cancelled successfully"
      })
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
                <p className="font-medium">
                  Order #{order.id.slice(-8).toUpperCase()}
                </p>
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
                    onClick={() => cancelOrder(order.id)}
                  >
                    {loading ? "Cancelling..." : "Cancel"}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {order.items.length === 0 || order.status !== "CANCELLED" && (
                <>
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={"/placeholder-image.jpg"}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover rounded-md"
                          priority
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                          {item.size && ` • ${item.size}`}
                        </p>
                      </div>
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="flex justify-between items-start">
              <div className="space-y-1">
                {(order.phone_number || order.comment) && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    {order.phone_number && (
                      <p>Contact: {order.phone_number}</p>
                    )}
                    {order.comment && (
                      <p>Note: {order.comment}</p>
                    )}
                  </div>
                )}
              </div>
              {order.status !== "CANCELLED" && (
                <div className="text-right">
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-2xl font-bold tracking-tight">
                  ${order.total.toFixed(2)}
                </p>
              </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
} 