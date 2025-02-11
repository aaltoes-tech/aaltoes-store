import prisma  from '@/lib/prisma'
import Image from 'next/image'
import { Suspense } from 'react'
import Navbar from './components/Navbar'

async function getProducts() {
  const products = await prisma.product.findMany()
  return products
}

interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  image?: string | null
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#f6f7f8"/>
</svg>`

const toBase64 = (str: string) => typeof window === 'undefined' 
  ? Buffer.from(str).toString('base64')
  : window.btoa(str)

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: Product) => (
        <div 
          key={product.id} 
          className="border rounded-lg overflow-hidden shadow-lg font-[var(--font-geist-sans)]"
        >
          {product.image && (
            <Image 
              src={product.image}
              alt={product.name}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
              placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 300))}`}
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 font-[var(--font-geist-sans)]">{product.name}</h2>
            <p className="text-gray-600 mb-2 font-[var(--font-geist-sans)]">{product.description}</p>
            <p className="text-lg font-bold font-[var(--font-geist-sans)]">${product.price}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-[var(--font-geist-sans)]">
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function Home() {
  const products = await getProducts()

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center space-y-4 mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome to Aaltoes Brand Store
          </h1>
          {products.length === 0 && (
            <p className="text-lg text-muted-foreground max-w-2xl">
              The products will be available soon. Stay tuned!
            </p>
          )}
        </div>
        
        {products && (
          <Suspense 
            fallback={
              <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
                Loading products...
              </div>
            }
          >
            <ProductGrid products={products} />
          </Suspense>
        )}
      </main>
    </>
  )
}
