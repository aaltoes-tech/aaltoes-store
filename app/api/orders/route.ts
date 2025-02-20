import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { Prisma } from "@prisma/client"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { phone, comment } = await req.json()

    const cart = await prisma.cart.findFirst({
      where: { user_id: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const total = cart.items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    )

    const orderData: Prisma.OrderCreateInput = {
      user: {
        connect: { id: session.user.id }
      },
      phone_number: phone || "",
      comment: comment || "",
      total,
      items: {
        create: cart.items.map(item => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          total: item.product.price * item.quantity,
          size: item.size
        }))
      }
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: true
      }
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
} 