import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Navbar from "@/app/components/Navbar"
import { OrderList } from "./OrderList"
import { ArrowLeft } from "@geist-ui/icons"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Add caching
export const revalidate = 60 // Revalidate every minute
export const dynamic = 'force-dynamic'
export const preferredRegion = 'fra1'

async function getOrders(userId: string) {
  // Optimize query by selecting only needed fields
  return prisma.order.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          quantity: true,
          total: true,
          size: true,
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              type: true,
              status: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10 // Limit initial load
  })
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/")
  }

  const orders = await getOrders(session.user.id)

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        </div>
        <div className="flex justify-between mb-8">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-muted-foreground"
            )}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Store
          </Link>
        </div>
        <OrderList initialOrders={orders} />
      </main>
    </>
  )
} 