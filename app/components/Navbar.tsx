"use client"

import { ThemeToggle } from "./ThemeToggle"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster" 
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const { toast } = useToast()

  const handleSignIn = () => {
    toast({
      description: "🚧 Authentication is not available yet. Website is under development.",
      duration: 3000,
    })
  }

  return (
    <nav>
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button onClick={handleSignIn}>
            Sign in
          </Button>
        </div>
      </div>
    </nav>
  )
} 