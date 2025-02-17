'use client'

import { Button } from "@/components/ui/button"
import { useSession, signIn } from "next-auth/react"

export function ProductButton() {
  const { status } = useSession()
  
  const handleClick = () => {
    if (status !== "authenticated") {
      signIn('google')
    }
  }
  
  return (
    <Button 
      variant="default" 
      disabled={status === "authenticated"}
      onClick={handleClick}
      className="mt-4 w-full text-sm md:text-base"
    >
      {status === "authenticated" ? "Coming soon" : "Add to cart"}
    </Button>
  )
} 