"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ImageCropperProps {
  imageFile: File
  onCrop: (file: File, cropData: Crop) => void
  onCancel: () => void
}

export function ImageCropper({ imageFile, onCrop, onCancel }: ImageCropperProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  })
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || null)
    })
    reader.readAsDataURL(imageFile)
  }, [imageFile])

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[80vw] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image Area</DialogTitle>
          <DialogDescription>
            Select the area of the image you want to use. If you want to use the whole image, just press cancel.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden p-4">
          {imgSrc && (
            <div className="flex items-center justify-center h-full">
              <div className="relative" style={{ maxHeight: 'calc(80vh - 8rem)' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  minWidth={100}
                  minHeight={100}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop preview"
                    style={{ 
                      maxWidth: '80vw',
                      maxHeight: 'calc(80vh - 8rem)',
                      objectFit: 'contain'
                    }}
                  />
                </ReactCrop>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onCrop(imageFile, crop)}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 