"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateRoleSchema = z.object({
  id: z.string(),
  role: z.enum(["User", "Admin"])
})

export async function updateUserRole(values: z.infer<typeof updateRoleSchema>) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "Admin") {
    throw new Error("Unauthorized")
  }

  const { id, role } = updateRoleSchema.parse(values)

  await prisma.user.update({
    where: { id },
    data: { role }
  })

  // Delete user's sessions to force re-login with new role
  await prisma.session.deleteMany({
    where: { userId: id }
  })

  revalidatePath("/admin")
}

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })
} 