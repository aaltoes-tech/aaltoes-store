"use client"

import { Product, User } from "@prisma/client"
import Navbar from "@/app/components/Navbar"
import { ProductTable } from "./components/ProductTable"
import { UserTable } from "./components/UserTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ShoppingBag } from "@geist-ui/icons"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AddProductForm } from "./components/AddProductForm"
import { getProducts } from "./actions"

interface AdminClientProps {
  initialProducts: Product[]
  initialUsers: User[]
}

export function AdminClient({ initialProducts, initialUsers }: AdminClientProps) {
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [products, setProducts] = useState(initialProducts)
  const [users] = useState(initialUsers)

  const refreshProducts = async () => {
    const freshProducts = await getProducts()
    setProducts(freshProducts)
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6 mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <div className="flex gap-4">
            <Button onClick={() => setIsAddingProduct(true)}>
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
            <Link href="/admin/orders">
              <Button variant="outline">
                <ShoppingBag size={16} className="mr-2" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>
        <UserTable users={users} />
        <ProductTable products={products} onProductAdded={refreshProducts} />

        <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product by filling out the details below.
              </DialogDescription>
            </DialogHeader>
            <AddProductForm 
              onClose={() => setIsAddingProduct(false)}
              onSuccess={() => {
                setIsAddingProduct(false)
                refreshProducts()
              }}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
} 