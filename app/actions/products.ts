'use server'

import { prisma } from "@/lib/prisma"

export async function getProducts() {
  return prisma.product.findMany({
    where: {
      status: "active"
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
} 