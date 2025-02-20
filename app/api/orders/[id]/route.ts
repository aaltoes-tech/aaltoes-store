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
    const { status } = await req.json()

    const order = await prisma.order.findUnique({
      where: { id: id },
      select: { user_id: true }
    })

    if (!order || order.user_id !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // If cancelling, delete order items first
    if (status === "CANCELLED") {
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
} 