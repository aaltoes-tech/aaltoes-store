import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.product.delete({
      where: { id: id }
    })
    
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const json = await req.json()
    
    if (!json || typeof json !== 'object') {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id },
      data: json
    })

    revalidatePath('/')  // Revalidate main page
    revalidatePath('/admin')  // Revalidate admin page
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
} 