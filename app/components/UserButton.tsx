"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from "next/link"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { 
  Home, 
  LogOut, 
  Settings, 
  Moon, 
  Sun, 
  Shield 
} from "@geist-ui/icons"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface UserButtonProps {
  user: {
    id: string
    name?: string | null
    email: string
    image?: string | null
    role: string
  }
}

export function UserButton({ user }: UserButtonProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 h-auto p-2 hover:bg-accent font-sans normal-case"
        >
          <div className="w-6-[100%] h-[100%] relative">
            <Avatar>
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>
                {user.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64" 
        align="end"
        alignOffset={4}
      >
        <div className="flex flex-col px-2 py-1.5 border-b">
          <span className="text-sm font-medium">{user.name || 'User'}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem asChild className="focus:ring-0 focus-visible:ring-0">
            <Link href="/" className="flex items-center gap-2 px-2 py-2 cursor-pointer">
              <Home size={16} className="text-muted-foreground" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/orders`} className="flex items-center gap-2 px-2 py-2 cursor-pointer">
              <Settings size={16} className="text-muted-foreground" />
              <span>My Orders</span>
            </Link>
          </DropdownMenuItem>
          {user.role === "Admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2 px-2 py-2 cursor-pointer">
                <Shield size={16} className="text-muted-foreground" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-2 py-2 cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun size={16} className="text-muted-foreground" />
            ) : (
              <Moon size={16} className="text-muted-foreground" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-2 py-2 text-destructive focus:text-destructive"
          >
            <LogOut size={16} className="text-current" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 