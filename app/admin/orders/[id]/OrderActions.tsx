"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { cancelOrder, completeOrder } from "../actions"
import { useRouter } from "next/navigation"

export function OrderActions({ orderId }: { orderId: string }) {
  const router = useRouter()

  return (
    <div className="flex justify-center gap-4 pt-8">
      <form action={async () => {
        await cancelOrder(orderId)
        toast({
          description: "Order cancelled successfully"
        })
        router.refresh()
      }}>
        <Button type="submit" variant="destructive">
          Cancel Order
        </Button>
      </form>
      <form action={async () => {
        await completeOrder(orderId)
        toast({
          description: "Order completed successfully"
        })
        router.refresh()
      }}>
        <Button type="submit">
          Complete Order
        </Button>
      </form>
    </div>
  )
} 