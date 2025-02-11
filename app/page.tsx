import Image from 'next/image'
import Navbar from './components/Navbar'
import { Button } from '@/components/ui/button'


export default async function Home() {
  const placeholderProducts = [
    {
      id: '1',
      name: 'Aaltoes Hoodie',
      description: 'Comfortable hoodie with Aaltoes logo',
      price: 49.99,
      image: '/hoodie.jpg'
    },
    {
      id: '2',
      name: 'Aaltoes T-Shirt',
      description: 'Classic cotton t-shirt',
      price: 29.99,
      image: '/t-shirt.jpg'
    },
    {
      id: '3',
      name: 'Aaltoes Cap',
      description: 'Stylish cap',
      price: 24.99,
      image: '/cap.jpg'
    }
  ]

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        <div className="flex flex-col items-center space-y-4 mb-8 md:mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Welcome to Aaltoes Brand Store
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Our store is coming soon! Here&apos;s a preview of what&apos;s to come.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {placeholderProducts.map((product) => (
            <div 
              key={product.id} 
              className="border rounded-lg overflow-hidden shadow-lg bg-card"
            >
              <div className="aspect-[3/2] relative bg-muted">
                <Image 
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover opacity-50"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg md:text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-sm md:text-base text-muted-foreground mb-2">{product.description}</p>
                <p className="text-lg font-bold">${product.price}</p>
                <Button 
                  className="mt-4 w-full text-sm md:text-base" 
                  disabled
                >
                  Coming Soon
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground text-center mt-6 space-y-1 italic">
          <p>Note: Displayed prices are preliminary and will be updated at launch.</p>
          <p>Images shown are placeholders and do not represent final products.</p>
        </div>
      </main>
    </>
  )
}
