import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { phone, comment, total } = await req.json()

    // Use a transaction to ensure data consistency and optimize performance
    const order = await prisma.$transaction(async (tx) => {
      // Get cart items in a single query with all needed data
      const cart = await tx.cart.findFirst({
        where: { user_id: session.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  price: true,
                  status: true
                }
              }
            }
          }
        }
      })

      if (!cart?.items.length) {
        throw new Error("Cart is empty")
      }

      // Verify all products are available
      const unavailableProduct = cart.items.find(
        item => item.product.status === 'removed'
      )
      if (unavailableProduct) {
        throw new Error("Some products are no longer available")
      }

      // Create order with items in a single transaction
      const order = await tx.order.create({
        data: {
          user_id: session.user.id,
          total,
          phone_number: phone || "",
          comment: comment || "",
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              size: item.size,
              total: item.quantity * item.product.price
            }))
          }
        }
      })

      // Delete cart items in bulk
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      })

      return order
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === "Cart is empty" ? 400 : 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
} 