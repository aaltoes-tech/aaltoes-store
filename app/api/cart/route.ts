import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { productId, quantity = 1, size } = await req.json()

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { user_id: session.user.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: session.user.id }
      })
    }

    // First get the product to check its type
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart with same size (if size matters)
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        ...(PRODUCT_TYPE_CONFIG[product.type].hasSize ? { size } : {})
      },
      include: {
        product: true
      }
    })

    if (existingItem) {
      // Update quantity of existing item
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + quantity 
        }
      })
      return NextResponse.json({ 
        ...updatedItem, 
        isExisting: true,
        message: updatedItem.quantity > 1
          ? `This item is already in cart, quantity updated`
          : "Item added to cart"
      })
    }

    // Create new item if it doesn't exist
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size
      }
    })

    return NextResponse.json({ 
      ...cartItem, 
      isExisting: false,
      message: "Added to cart"
    })
  } catch (error) {
    console.error('Cart error:', error)
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    )
  }
} 