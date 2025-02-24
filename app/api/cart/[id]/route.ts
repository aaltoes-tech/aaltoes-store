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
    const { quantity } = await req.json()

    // Validate quantity
    if (quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }

    // Update quantity in a single optimized query
    const cartItem = await prisma.$transaction(async (tx) => {
      // Verify cart ownership and update in one query
      const item = await tx.cartItem.findFirst({
        where: {
          id,
          cart: {
            user_id: session.user.id
          }
        }
      })

      if (!item) {
        throw new Error("Item not found")
      }

      return tx.cartItem.update({
        where: { id },
        data: { quantity },
        select: {
          id: true,
          quantity: true
        }
      })
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Cart update error:', error)
    if (error instanceof Error && error.message === "Item not found") {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.cartItem.delete({
      where: { id }
    })
    
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete cart item:', error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    )
  }
} 