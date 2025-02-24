"use client"

import { useState, useMemo } from "react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { OrderStatusFilter } from "@/app/orders/OrderStatusFilter"
import { OrderWithDetails } from "@/app/types"
import { Copy, Search } from "@geist-ui/icons"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { truncateId } from "@/app/utils/utils"
import { Input } from "@/components/ui/input"

interface AdminOrdersPageProps {
  initialOrders: OrderWithDetails[]
}

export default function AdminOrdersPage({ initialOrders }: AdminOrdersPageProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "PENDING",
    "PROCESSING"
  ])
  const [search, setSearch] = useState("")
  const { toast } = useToast()


  const filteredOrders = useMemo(() => {
    if (selectedStatuses.length === 0) return []
    
    return initialOrders.filter(order => {
      const matchesStatus = selectedStatuses.includes(order.status)
      const searchTerm = search.toLowerCase()
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm) ||
        order.user.name?.toLowerCase().includes(searchTerm) ||
        order.user.email.toLowerCase().includes(searchTerm)

      return matchesStatus && (search === "" || matchesSearch)
    })
  }, [initialOrders, selectedStatuses, search])

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      toast({
        description: "Order ID copied to clipboard"
      })
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to copy order ID"
      })
    }
  }

  return (
    <>
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <OrderStatusFilter
          selectedStatuses={selectedStatuses}
          onChange={setSelectedStatuses}
        />
      </div>

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
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Order #{truncateId(order.id)}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault()
                          handleCopyId(order.id)
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
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