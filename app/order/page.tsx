import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Navbar from "@/app/components/Navbar"
import { prisma } from "@/lib/prisma"
import { OrderClient } from "./OrderClient"

async function getCartTotal(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: { user_id: userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!cart) return 0

  return cart.items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  )
}

export default async function OrderPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/")
  }

  const subtotal = await getCartTotal(session.user.id)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <>
      <Navbar />
      <OrderClient 
        session={session}
        subtotal={subtotal}
        total={total}
      />
    </>
  )
} 