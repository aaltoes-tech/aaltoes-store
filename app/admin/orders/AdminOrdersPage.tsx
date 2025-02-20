"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { OrderStatusFilter } from "@/app/orders/OrderStatusFilter"
import { OrderWithDetails } from "@/app/types"

interface AdminOrdersPageProps {
  initialOrders: OrderWithDetails[]
}

export default function AdminOrdersPage({ initialOrders }: AdminOrdersPageProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "PENDING",
    "PROCESSING"
  ])

  const filteredOrders = selectedStatuses.length === 0
    ? []
    : initialOrders.filter(order => selectedStatuses.includes(order.status))

  return (
    <>

        <OrderStatusFilter
          selectedStatuses={selectedStatuses}
          onChange={setSelectedStatuses}
        />

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {selectedStatuses.length === 0 
                ? "Select a status to filter orders"
                : "No orders found with selected statuses"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link 
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block transition-colors hover:bg-muted/50"
              >
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.user.name} ({order.user.email})
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          order.status === "PENDING" ? "default" :
                          order.status === "PROCESSING" ? "secondary" :
                          order.status === "DELIVERED" ? "outline" :
                          "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
    </>
  )
} 