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

    const cartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity }
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Cart update error:', error)
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