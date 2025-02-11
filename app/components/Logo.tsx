"use client"

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function Logo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Image 
        src="/aaltoes_white.png"
        alt="Aaltoes logo"
        width={150}
        height={40}
        priority
      />
    )
  }

  return (
    <Image 
      src={theme === 'dark' ? '/aaltoes_white.png' : '/aaltoes_dark.png'}
      alt="Aaltoes logo"
      width={150}
      height={40}
      priority
    />
  )
} 