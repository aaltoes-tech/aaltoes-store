"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "@geist-ui/icons"

export function CartButton() {
  return (
    <Link href="/cart">
      <Button 
        variant="ghost" 
        size="icon"
        className="relative"
      >
        <ShoppingCart size={16} />
      </Button>
    </Link>
  )
} 