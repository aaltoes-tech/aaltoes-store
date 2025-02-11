"use client"

import { ThemeToggle } from "./ThemeToggle"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav>
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button>
            Sign in
          </Button>
        </div>
      </div>
    </nav>
  )
} 