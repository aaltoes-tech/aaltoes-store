"use client"

import { Product, Size as PrismaSize, ProductType as PrismaProductType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import { Label } from "@/components/ui/label"

interface EditProductFormProps {
  product: Product
  onSubmit: (data: Partial<Product>) => Promise<void>
  onCancel: () => void
}

export function EditProductForm({ product, onSubmit, onCancel }: EditProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [sizes, setSizes] = useState<PrismaSize[]>(product.sizes || [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      type: formData.get("type") as PrismaProductType,
      sizes: sizes,
    }

    try {
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={product.name}
            placeholder="Product name"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product.description}
            placeholder="Product description"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product.price}
            placeholder="Price"
            required
          />
        </div>

        {PRODUCT_TYPE_CONFIG[product.type].hasSize && (
          <div className="space-y-2">
            <Label>Available Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPE_CONFIG[product.type].sizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={sizes.includes(size) ? "default" : "outline"}
                  onClick={() => {
                    if (sizes.includes(size)) {
                      setSizes(sizes.filter(s => s !== size))
                    } else {
                      setSizes([...sizes, size])
                    }
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
} 