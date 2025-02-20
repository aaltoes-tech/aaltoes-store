'use client'

import { Button } from "@/components/ui/button"
import { useSession, signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface ProductButtonProps {
  className?: string;
  productId: string;
  size?: string;
  disabled?: boolean;
  onSuccess?: () => void;
  closeOnSuccess?: boolean;
}

export function ProductButton({ className, productId, size, disabled, onSuccess, closeOnSuccess = false }: ProductButtonProps) {
  const { status } = useSession()
  const { toast } = useToast()
  
  const handleClick = async () => {
    if (status !== "authenticated") {
      signIn('google')
      return
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, size }),
      })

      if (!res.ok) throw new Error()
      
      const data = await res.json()
      
      toast({
        title: "Success",
        description: data.message
      })
      if (closeOnSuccess) {
        onSuccess?.()
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    }
  }
  
  return (
    <Button 
      variant="default" 
      onClick={handleClick}
      disabled={disabled}
      className={`mt-4 w-full text-sm md:text-base ${className || ''}`}
    >
      {disabled ? "Select a size" : "Add to Cart"}
    </Button>
  )
} 