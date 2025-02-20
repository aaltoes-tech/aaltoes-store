"use client"

import { Product, User } from "@prisma/client"
import Navbar from "@/app/components/Navbar"
import { ProductTable } from "./components/ProductTable"
import { UserTable } from "./components/UserTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ShoppingBag } from "@geist-ui/icons"
import { useState } from "react"
import { getProducts } from "./actions"

interface AdminClientProps {
  initialProducts: Product[]
  initialUsers: User[]
}

export function AdminClient({ initialProducts, initialUsers }: AdminClientProps) {
  const [users] = useState(initialUsers)

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6 mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <div className="flex gap-4">
            <Link href="/admin/add">
              <Button>
                <Plus size={16} className="mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline">
                <ShoppingBag size={16} className="mr-2" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>
        <UserTable users={users} />
        <ProductTable products={initialProducts} onProductAdded={getProducts} />
      </main>
    </div>
  )
} 