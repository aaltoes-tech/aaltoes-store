import { prisma } from '@/lib/prisma'

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

export default async function Home() {
  const products = await getProducts()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <div 
            key={product.id} 
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold">${product.price}</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
