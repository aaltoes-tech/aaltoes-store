'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getOrders() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return []
  }

  const orders = await prisma.order.findMany({
    where: {
      user_id: session.user.id
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              type: true,
              status: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return orders
} 