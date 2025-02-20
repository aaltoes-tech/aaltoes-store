"use client"

import { useState } from "react"
import { Product, ProductStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Edit, Delete, ArrowUpCircle } from "@geist-ui/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { EditProductForm } from "./EditProductForm"
import { Badge } from "@/components/ui/badge"
import { PRODUCT_TYPE_CONFIG } from "@/app/lib/constants"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductFilters } from "@/app/components/ProductFilters"
import { ProductType, Size } from "@/app/lib/constants"

interface ProductTableProps {
  products: Product[]
  onProductAdded: () => Promise<Product[]>
}

export function ProductTable({ products: initialProducts, onProductAdded }: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [typeFilter, setTypeFilter] = useState<ProductType | "all" | "">("all")
  const [sizeFilter, setSizeFilter] = useState<Size | "all" | "">("all")
  const [search, setSearch] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("")


  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: ProductStatus.removed })
      })
      
      if (!res.ok) throw new Error()
      
      const freshProducts = await onProductAdded()
      setProducts(freshProducts)
      setFilteredProducts(freshProducts)
      
      toast({ description: "Product removed successfully" })
    } catch {
      toast({ 
        variant: "destructive", 
        description: "Failed to remove product" 
      })
    }
  }

  async function handleUpdate(id: string, data: Partial<Product>) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (!res.ok) throw new Error()
      
      const freshProducts = await onProductAdded()
      setProducts(freshProducts)
      setFilteredProducts(freshProducts)
      
      setEditingProduct(null)
      toast({ description: "Product updated successfully" })
    } catch {
      toast({ 
        variant: "destructive", 
        description: "Failed to update product" 
      })
    }
  }

  async function handleRestore(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: ProductStatus.active })
      })
      
      if (!res.ok) throw new Error()
      
      const updatedProducts = products.map(p => 
        p.id === id ? { ...p, status: ProductStatus.active } : p
      )
      setProducts(updatedProducts)
      setFilteredProducts(updatedProducts)
      
      toast({ description: "Product restored successfully" })
    } catch {
      toast({ 
        variant: "destructive", 
        description: "Failed to restore product" 
      })
    }
  }

  const applyFilters = (
    searchValue: string = search,
    type: ProductType | "all" | "" = typeFilter,
    size: Size | "all" | "" = sizeFilter,
    sort: "asc" | "desc" | "" = sortOrder,
  ) => {
    let filtered = products.filter((product) => {
      const matchesSearch = 
        searchValue === "" ||
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.description.toLowerCase().includes(searchValue.toLowerCase())
      
      const matchesType = 
        type === "" || 
        type === "all" || 
        product.type === type

      const matchesSize = 
        size === "" || 
        size === "all" || 
        product.sizes.includes(size)

      return matchesSearch && matchesType && matchesSize
    })

    // Apply sorting
    if (sort === "asc") {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sort === "desc") {
      filtered = filtered.sort((a, b) => b.price - a.price)
    }

    setFilteredProducts(filtered)
  }

  const resetFilters = () => {
    setSearch("")
    setTypeFilter("all")
    setSizeFilter("all")
    setSortOrder("")
    setFilteredProducts(products)
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
      </div>

      <ProductFilters
        onSearchChange={(value) => {
          setSearch(value)
          applyFilters(value)
        }}
        onTypeChange={(value) => {
          setTypeFilter(value)
          applyFilters(undefined, value)
        }}
        onSizeChange={(value) => {
          setSizeFilter(value)
          applyFilters(undefined, undefined, value)
        }}
        onSortChange={(value) => {
          setSortOrder(value)
          applyFilters(undefined, undefined, undefined, value)
        }}
        onReset={resetFilters}
        currentType={typeFilter}
        currentSize={sizeFilter}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-muted-foreground">
            No products found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or add a new product
          </p>
        </div>
      ) : (
        <div className="max-h-[500px] mt-4">
          <Table>
            <TableHeader className="sticky top-0 bg-background border-b">
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[100px] text-center">Type</TableHead>
                <TableHead className="w-[150px] text-center">Sizes</TableHead>
                <TableHead className="w-[100px] text-right">Price</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {PRODUCT_TYPE_CONFIG[product.type].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {PRODUCT_TYPE_CONFIG[product.type].hasSize ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {product.sizes.map((size) => (
                          <Badge key={size} variant="outline" className="text-xs">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Badge variant="outline" className="text-xs">
                          Standard
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">${product.price}</TableCell> 
                  <TableCell className="text-center">
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit size={16} />
                      </Button>

                      {product.status === ProductStatus.active ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Delete size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the product from the store. You can restore it later.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button 
                          variant="default" 
                          size="icon"
                          onClick={() => handleRestore(product.id)}
                        >
                          <ArrowUpCircle size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle>Edit Product</DialogTitle>
              {editingProduct && (
                <Badge variant="secondary">
                  {PRODUCT_TYPE_CONFIG[editingProduct.type].label}
                </Badge>
              )}
            </div>
          </DialogHeader>
          {editingProduct && (
            <EditProductForm
              product={editingProduct}
              onSubmit={(data: Partial<Product>) => handleUpdate(editingProduct.id, data)}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 