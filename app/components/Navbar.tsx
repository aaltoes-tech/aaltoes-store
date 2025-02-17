"use client"

import { ThemeToggle } from "./ThemeToggle"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { status } = useSession();
  
  return (
    <nav>
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {status === "authenticated" ? (
            <Button variant="default" onClick={() => signOut()}>
              Sign out
            </Button>
          ) : status !== "loading" && (
            <Button
              variant="default"
              onClick={(e) => {
                e.preventDefault()
                signIn('google')
              }}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
} 