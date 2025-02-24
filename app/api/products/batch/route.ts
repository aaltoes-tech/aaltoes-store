import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { productIds } = await req.json()
    
    // Batch fetch multiple products
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    })
    
    return Response.json(products)
  } catch (error) {
    return Response.json({ 
      error: error instanceof Error ? error.message : "Failed to process products" 
    }, { status: 500 })
  }
} 