'use server'

import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false }
  }
}

export async function cancelOrder(orderId: string) {
  try {
    // Delete order items
    await prisma.orderItem.deleteMany({
      where: { orderId }
    })

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return { success: false }
  }
}

export async function completeOrder(orderId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to complete order:', error);
    return { success: false }
  }
} 