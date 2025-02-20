'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "@geist-ui/icons"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle size={24} />
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
      </div>
      <p className="text-muted-foreground text-center max-w-[500px]">
        We encountered an error while loading your cart. Please try again or contact support if the problem persists.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          <ArrowLeft size={16} className="mr-2" />
          Return Home
        </Button>
      </div>
    </div>
  )
} 