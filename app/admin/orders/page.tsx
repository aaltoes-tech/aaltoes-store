import { prisma } from "@/lib/prisma"
import AdminOrdersPage from "./AdminOrdersPage"
import Navbar from "@/app/components/Navbar"
import { ArrowLeft } from "@geist-ui/icons"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
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

  return orders
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "Admin") {
    redirect("/")
  }

  const initialOrders = await getOrders()

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight ml-auto mr-auto">Orders</h1>
        </div>
        <div className="flex justify-between mb-8">
          <Link
            href="/admin"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-muted-foreground"
            )}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Admin
          </Link>
        </div>
        <AdminOrdersPage initialOrders={initialOrders} />
      </main>
    </>
  )
}