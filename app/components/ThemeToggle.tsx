"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "@geist-ui/icons"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-md  relative w-10 h-10">
        <div className="relative w-5 h-5">
          <Sun className="transform opacity-100" />
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-accent relative w-10 h-10"
    >
      <div className="relative w-5 h-5">
        <div className="transition-all duration-300 absolute inset-0">
          <Sun 
            className={`transform ${
              theme === 'dark' ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
            }`}
          />
        </div>
        <div className="transition-all duration-300 absolute inset-0">
          <Moon 
            className={`transform ${
              theme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
            }`}
          />
        </div>
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}