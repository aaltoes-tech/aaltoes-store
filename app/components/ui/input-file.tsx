"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageCropper } from "./image-cropper"
import { type Crop } from 'react-image-crop'

interface InputFileProps {
  onChange?: (file: File, cropData?: Crop) => void
  name?: string
  label?: string
  accept?: string
  required?: boolean
}

export function InputFile({ 
  onChange,
  name = "image",
  label = "Image", 
  accept = "image/*",
  required = false 
}: InputFileProps) {
  const [cropFile, setCropFile] = useState<File | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setCropFile(file)
    }
  }

  return (
    <>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          name={name}
          type="file"
          accept={accept}
          required={required}
          onChange={handleFileChange}
        />
      </div>

      {cropFile && (
        <ImageCropper
          imageFile={cropFile}
          onCrop={(file, cropData) => {
            onChange?.(file, cropData)
            setCropFile(null)
          }}
          onCancel={() => setCropFile(null)}
        />
      )}
    </>
  )
} 