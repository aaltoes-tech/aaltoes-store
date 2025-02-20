'use server'

import { prisma } from "@/lib/prisma"
import { ProductStatus } from "@prisma/client"

export async function getProducts() {
  return prisma.product.findMany({
    where: {
      status: ProductStatus.active
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
} 