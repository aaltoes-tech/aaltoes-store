import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import sharp from 'sharp'
import { type Crop } from 'react-image-crop'
import { pinata } from "@/app/utils/config"
import { ProductStatus, ProductType, Size } from "@/app/lib/constants"

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()

  
  if (data.status === ProductStatus.removed) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: id }
      })
  
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
  
      if (product.image) {
        try {
          const oldImage = product.image.split('/').pop()
          if (oldImage) {
            await pinata.unpin([oldImage])
          }
        } catch (error) {
          console.error('Error deleting old image:', error)
        }
      }
  
      await prisma.product.update({
        where: { id: id },
        data: {
          status: ProductStatus.removed,
          image: "ss"
        }
      })
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }
  }

  if (data.status === ProductStatus.active) {
    try {
      await prisma.product.update({
        where: { id: id },
        data: {
          status: ProductStatus.active
        }
      })
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error activating product:', error)
      return NextResponse.json({ error: "Failed to activate product" }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Invalid status" }, { status: 400 })
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const cropDataStr = formData.get('cropData') as string | null
    
    let imageUrl = undefined

    if (file) {
      const cropData = cropDataStr ? JSON.parse(cropDataStr) as Crop : null
      let imageBuffer = Buffer.from(await file.arrayBuffer())

      // Apply crop if cropData exists
      if (cropData) {
        const image = sharp(imageBuffer)
        const metadata = await image.metadata()
        
        if (metadata.width && metadata.height) {
          const cropX = Math.round((cropData.x * metadata.width) / 100)
          const cropY = Math.round((cropData.y * metadata.height) / 100)
          const cropWidth = Math.round((cropData.width * metadata.width) / 100)
          const cropHeight = Math.round((cropData.height * metadata.height) / 100)

          imageBuffer = await image
            .extract({ 
              left: cropX, 
              top: cropY, 
              width: cropWidth, 
              height: cropHeight 
            })
            .toBuffer()
        }
      }

      // Convert buffer to File for Pinata
      const croppedFile = new File([imageBuffer], file.name, { type: file.type })
      const uploadData = await pinata.upload.file(croppedFile)
      imageUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${uploadData.IpfsHash}`
    }

    const oldProduct = await prisma.product.findUnique({
      where: { id: id }
    })

    if (oldProduct?.image && imageUrl) {
      try {
        const oldImage = oldProduct.image.split('/').pop()
        if (oldImage) {
          await pinata.unpin([oldImage])
        }
      } catch (error) {
        console.error('Error deleting old image:', error)
      }
    }

    const product = await prisma.product.update({
      where: { id: id },
      data: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        ...(imageUrl && { image: imageUrl }),
        type: formData.get('type') as ProductType,
        sizes: JSON.parse(formData.get('sizes') as string) as Size[],
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
} 