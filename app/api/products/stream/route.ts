import { prisma } from '@/lib/prisma'
import { TransformStream } from 'web-streams-polyfill'

export async function GET() {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  
  // Stream products in chunks
  const products = await prisma.product.findMany()
  const chunkSize = 100
  
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize)
    await writer.write(JSON.stringify(chunk))
  }
  
  writer.close()
  
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked'
    }
  })
} 