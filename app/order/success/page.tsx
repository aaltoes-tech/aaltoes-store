import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function OrderSuccessPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/")
  }

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Order Placed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We will notify you when it&apos;s ready for pickup at Startup Sauna.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link href={`/orders`}>
              <Button>View Orders</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
} 