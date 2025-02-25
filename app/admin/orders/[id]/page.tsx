import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Navbar from "@/app/components/Navbar"
import { OrderDetails } from "./OrderDetails"
import { updateOrderStatus } from "../actions"

async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              image: true,
              type: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              sizes: true
            }
          }
        }
      }
    }
  })

  return order
}

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "Admin") {
    redirect("/")
  }

  let order = await getOrder(id)
  
  if (!order) {
    redirect("/admin/orders")
  }

  if (order.status === "PENDING") {
    await updateOrderStatus(id, "PROCESSING")
    order = await getOrder(id) || order
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container max-w-6xl mx-auto p-6">
        <OrderDetails order={order} />
      </div>
    </div>
  )
} 
