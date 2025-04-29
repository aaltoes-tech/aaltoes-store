"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { completeOrder, cancelOrder } from "../actions"

export function OrderActions({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast({
        variant: "destructive",
        title: "Cancellation reason is required",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await cancelOrder(orderId, cancelReason)
      
      if (!result.success) throw new Error()

      toast({
        title: "Order cancelled successfully",
      })
      setShowCancelDialog(false)
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to cancel order",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center gap-4 py-8">
      <Button 
        variant="destructive" 
        onClick={() => setShowCancelDialog(true)}
      >
        Cancel Order
      </Button>

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

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Reason for Cancellation (Required)
            </label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this order..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {isLoading ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 