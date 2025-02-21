"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { OrderStatus, OrderItem, Product } from "@prisma/client"
import { OrderWithDetails } from "@/app/types"

interface OrderDetailsProps {
  order: OrderWithDetails
  isOpen: boolean
  onClose: () => void
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>
}

export function OrderDetails({ order, isOpen, onClose, onStatusChange }: OrderDetailsProps) {
  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-medium">{order.id}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-medium">{order.user.name}</p>
            <p className="text-sm text-muted-foreground">{order.user.email}</p>
            {order.phone_number && (
              <p className="text-sm">{order.phone_number}</p>
            )}
          </div>

          {order.comment && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Comment</p>
              <p className="text-sm">{order.comment}</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Items</p>
            <div className="space-y-2">
              {order.items.map((item: OrderItem & { product: Product }) => (
                <div 
                  key={item.id} 
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    {item.size && (
                      <Badge variant="outline" className="mt-1">
                        {item.size}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.total} €</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="flex justify-between">
              <p className="font-medium">Total</p>
              <p className="font-medium">{order.total} €</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex gap-2">
                {(['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={order.status === status ? "default" : "outline"}
                    onClick={() => onStatusChange(order.id, status)}
                    disabled={order.status === status}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Created: {formatDate(order.createdAt)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 