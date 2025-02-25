import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { status, comment } = body

    // Check if order exists and user has access
    const order = await prisma.order.findUnique({
      where: { id },
      select: { user_id: true }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // For admin actions, skip user check
    if (session.user.role !== 'Admin') {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Handle order cancellation
    if (status === "CANCELLED") {
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      })
    }

    // Update order status and comment
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        ...(comment && { comment })
      }
    })

    return NextResponse.json(updatedOrder)

  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
} 