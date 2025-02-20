"use client"

import { AddProductForm } from "../components/AddProductForm"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const router = useRouter()

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
          <AddProductForm 
            onClose={() => router.push("/admin")}
            onSuccess={() => router.push("/admin")}
          />
        </div>
      </main>
    </div>
  )
} 