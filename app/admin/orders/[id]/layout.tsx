import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getOrder(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      items: {
        include: {
          product: true
        }
      }
    }
  })
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "Admin") {
    redirect("/")
  }

  const order = await getOrder(id)

  if (!order) {
    redirect("/admin/orders")
  }

  return (
    <>
      {children}
    </>
  )
}