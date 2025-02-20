"use client"

import { Minus, Plus } from "@geist-ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantityInput({ 
  value, 
  onChange, 
  min = 1, 
  max = 10 
}: QuantityInputProps) {
  return (
    <div className="inline-flex h-9 items-center rounded-md border border-input bg-transparent">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none border-r border-input"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus size={12} />
      </Button>
      <Input
        readOnly
        value={value}
        className="h-9 w-12 rounded-none border-0 text-center focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none border-l border-input"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus size={12} />
      </Button>
    </div>
  )
} 