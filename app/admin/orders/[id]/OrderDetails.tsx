"use client"

import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "@geist-ui/icons"
import { OrderActions } from "./OrderActions"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Product } from "@prisma/client"
import { useState } from "react"

interface OrderItem {
  id: string
  quantity: number
  total: number
  size: string | null
  product: Product
}

interface OrderDetailsProps {
  order: {
    id: string
    status: string
    createdAt: Date
    total: number
    items: OrderItem[]
    user: {
      name: string | null
      email: string
    }
    phone_number?: string
    comment?: string
  }
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="mb-8">
          <Link
            href="/admin/orders"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-muted-foreground"
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
            <p className="text-muted-foreground mt-2">
              Created on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge 
            variant={
              order.status === "PENDING" ? "default" :
              order.status === "PROCESSING" ? "secondary" :
              order.status === "DELIVERED" ? "outline" :
              "destructive"
            }
            className="text-base px-4 py-1"
          >
            {order.status}
          </Badge>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Customer Details</h2>
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Name:</span> {order.user.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {order.user.email}</p>
            {order.phone_number && (
              <p><span className="text-muted-foreground">Phone:</span> {order.phone_number}</p>
            )}
          </div>
          {order.comment && (
            <div className="pt-4 border-t">
              <p className="text-muted-foreground mb-2">Comment:</p>
              <p className="bg-background p-3 rounded-md">{order.comment}</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-4">Order Items</h2>
          {order.items.length === 0 ? (
            <div className="text-center py-8 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                This order was cancelled and all items were removed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {order.items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-4 border rounded-lg"
                >
                  <div className="relative w-20 h-20">
                    <Image
                      src={imageError ? '/placeholder-image.jpg' : item.product.image+"?img-width=800&img-format=webp"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="80px"
                      priority
                      onError={() => setImageError(true)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.description}
                        </p>
                        {item.size && (
                          <Badge variant="outline" className="mt-2 mr-2">
                            {item.size}
                          </Badge>
                        )}
                        {item.product.status === 'removed' && (
                          <Badge variant="destructive" className="mt-2">
                            Product unavailable
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.total}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Only show action buttons if order is not cancelled */}
        {order.status !== "CANCELLED" && (
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">${order.total}</p>
              </div>
            </div>
          </div>
        )}
        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
          <div className="flex justify-center gap-4 pt-8">
            <OrderActions orderId={order.id} />
          </div>
        )}
      </div>
    </main>
  )
} 