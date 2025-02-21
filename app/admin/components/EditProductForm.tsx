"use client"

import { Product, Size as PrismaSize, ProductType as PrismaProductType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef } from "react"
import { PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import { Label } from "@/components/ui/label"
import { InputFile } from "@/app/components/ui/input-file"
import { type Crop } from 'react-image-crop'
import { useToast } from "@/hooks/use-toast"

interface EditProductFormProps {
  product: Product
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
  onSuccess: () => void
}

export function EditProductForm({ product, onSubmit, onCancel, onSuccess }: EditProductFormProps) {

  const [loading, setLoading] = useState(false)
  const [sizes, setSizes] = useState<PrismaSize[]>(product.sizes || [])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [cropData, setCropData] = useState<Crop | null>(null)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('type', product.type)
    if (imageFile) {
      formData.append('file', imageFile)
    }
    if (cropData) {
      formData.append('cropData', JSON.stringify(cropData))
    }
    formData.append('sizes', JSON.stringify(sizes))

    try {
      await onSubmit(formData)
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      onSuccess()
      onCancel()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
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

      <InputFile
        onChange={(file, crop) => {
          setImageFile(file)
          setCropData(crop || null)
        }}
      />

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