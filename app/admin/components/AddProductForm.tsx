"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Size } from "@/app/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import { Label } from "@/components/ui/label"
import { Size as PrismaSize, ProductType as PrismaProductType } from "@prisma/client"

interface AddProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductForm({ onClose, onSuccess }: AddProductFormProps) {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  const [type, setType] = useState<PrismaProductType>('TSHIRT')
  const [sizes, setSizes] = useState<PrismaSize[]>([])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      type: type,
      sizes: sizes
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          status: 'active'  // Make sure this is set
        }),
      })
      
      const json = await response.json()
      
      if (!response.ok) {
        throw new Error(json.error || "Failed to create product")
      }
      
      toast({
        title: "Success",
        description: "Product created successfully",
      })

      formRef.current?.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (type) {
      if (!PRODUCT_TYPE_CONFIG[type].hasSize) {
        setSizes([Size.ONESIZE])
      } else {
        setSizes([])
      }
    }
  }, [type])

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder="Product name"
          required
        />
      </div>
      <div>
        <Input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          required
        />
      </div>
      <div>
        <Input
          name="image"
          placeholder="Image URL"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Product Type</Label>
        <Select
          value={type}
          onValueChange={(value: PrismaProductType) => {
            setType(value)
            setSizes([]) // Reset sizes when type changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PRODUCT_TYPE_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {PRODUCT_TYPE_CONFIG[type].hasSize && (
        <div className="space-y-2">
          <Label>Available Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_TYPE_CONFIG[type].sizes.map((size) => (
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

      <div>
        <Textarea
          name="description"
          placeholder="Product description"
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading || !type || (PRODUCT_TYPE_CONFIG[type].hasSize && sizes.length === 0)}
      >
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  )
} 