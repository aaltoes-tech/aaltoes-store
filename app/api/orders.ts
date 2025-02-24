import { OrderWithDetails } from "@/app/types"

export async function fetchOrders(): Promise<OrderWithDetails[]> {
  const res = await fetch('/api/orders')
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
} 