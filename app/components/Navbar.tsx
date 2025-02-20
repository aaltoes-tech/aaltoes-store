"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signIn } from "next-auth/react"
import { CartButton } from "./CartButton"
import { ThemeToggle } from "./ThemeToggle"
import { Logo } from "./Logo"
import { UserButton } from "./UserButton"

export default function Navbar() {
  const { data: session} = useSession()

  return (
    <>
      <div className="h-16" />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session?.user && <CartButton />}
            
            {session?.user ? (
              <UserButton user={session.user} />
            ) : (
              <Button onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
} 