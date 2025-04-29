'use server'

import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"
import { sendOrderStatusUpdateEmail } from "@/app/utils/send-email"

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                type: true,
                image: true
              }
            }
          }
        }
      }
    })

    // Send status update email
    await sendOrderStatusUpdateEmail({
      id: order.id,
      user: order.user,
      status: status,
      createdAt: order.createdAt
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false }
  }
}

export async function cancelOrder(orderId: string, reason: string) {
  try {
    // Update order status and get user info
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        comment: reason
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Send cancellation email
    await sendOrderStatusUpdateEmail({
      id: order.id,
      user: order.user,
      status: 'CANCELLED',
      createdAt: order.createdAt,
      comment: reason
    })

    // Delete order items
    await prisma.orderItem.deleteMany({
      where: { orderId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error cancelling order:', error)
    return { success: false }
  }
}

export async function completeOrder(orderId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Send completion email
    await sendOrderStatusUpdateEmail({
      id: order.id,
      user: order.user,
      status: "DELIVERED",
      createdAt: order.createdAt
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to complete order:', error);
    return { success: false }
  }
} 