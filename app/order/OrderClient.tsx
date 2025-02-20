"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "@geist-ui/icons"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Session } from "next-auth"

interface OrderClientProps {
  session: Session;  // from next-auth
  subtotal: number;
  total: number;
}

// Components
function OrderHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Back to Cart
      </Button>
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <div className="w-[100px]" />
    </div>
  )
}

function CustomerDetails({ name, email }: { name: string; email: string }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-1">
        <span className="font-medium">Name</span>
        <span className="text-muted-foreground">{name}</span>
      </div>
      <div className="grid gap-1">
        <span className="font-medium">Email</span>
        <span className="text-muted-foreground">{email}</span>
      </div>
    </div>
  )
}

function OrderSummary({ subtotal, total }: { subtotal: number; total: number }) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold tracking-tight mb-4">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-medium text-lg pt-4 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Note:</span> Orders are available for pickup at Startup Sauna. 
          We do not offer shipping services. You will be notified when your order is ready for collection.
        </p>
      </div>
    </div>
  )
}

// Main Component
export function OrderClient({ session, subtotal, total }: OrderClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      phone: formData.get("phone") as string,
      comment: formData.get("comment") as string,
      userId: session.user.id,
      total
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) throw new Error()

      toast({
        title: "Success",
        description: "Order placed successfully"
      })
      router.push('/order/success')
    } catch {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <OrderHeader onBack={() => router.push('/cart')} />

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-4">Order Details</h2>
                <div className="space-y-4">
                  <CustomerDetails 
                    name={session.user.name || 'Guest'} 
                    email={session.user.email || ''} 
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number (Optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll use this to notify you when your order is ready for pickup
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Order Comments</Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      placeholder="Add any special instructions or comments about your order"
                      className="h-24 resize-none"
                    />
                  </div>
                </div>
              </div>

              <OrderSummary subtotal={subtotal} total={total} />

              <div className="pt-6">
                <Button 
                  type="submit"
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  By placing your order, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
} 