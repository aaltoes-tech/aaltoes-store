"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PRODUCT_TYPE_CONFIG, ProductType } from "@/app/lib/constants"
import { formatDate } from "@/lib/utils"
import { OrderWithDetails } from "@/app/types"
import { OrderItem, Product } from "@prisma/client"

interface OrderDetailsProps {
  order: OrderWithDetails;
  isOpen: boolean
  onClose: () => void
  revalidate?: () => Promise<void>
}

export function OrderDetails({ order, isOpen, onClose, revalidate }: OrderDetailsProps) {
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
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>

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
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        {PRODUCT_TYPE_CONFIG[item.product.type as ProductType].label}
                      </Badge>
                      {item.size && (
                        <Badge variant="outline">
                          {item.size}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.product.price} €</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <p className="font-medium">Total</p>
              <p className="font-medium">{order.total} €</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 