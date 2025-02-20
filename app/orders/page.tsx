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

async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { user_id: userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export default async function UserOrdersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/")
  }

  const orders = await getOrders(session.user.id)

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight ml-auto mr-auto">My Orders</h1>
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