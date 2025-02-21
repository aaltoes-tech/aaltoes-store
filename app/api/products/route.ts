import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { ProductType, Size } from "@/app/lib/constants"
import { pinata } from "@/app/utils/config"
import sharp from 'sharp'
import { type Crop } from 'react-image-crop'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  
  if (!session?.user || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const cropDataStr = formData.get('cropData') as string
    const cropData = cropDataStr ? JSON.parse(cropDataStr) as Crop : null

    let imageBuffer = Buffer.from(await file.arrayBuffer())

    // Apply crop if cropData exists
    if (cropData) {
      const image = sharp(imageBuffer)
      const metadata = await image.metadata()
      
      if (metadata.width && metadata.height) {
        // Convert percentage to pixels
        const cropX = Math.round((cropData.x * metadata.width) / 100)
        const cropY = Math.round((cropData.y * metadata.height) / 100)
        const cropWidth = Math.round((cropData.width * metadata.width) / 100)
        const cropHeight = Math.round((cropData.height * metadata.height) / 100)

        // Apply crop
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

    // Convert buffer to File object for Pinata
    const croppedFile = new File([imageBuffer], file.name, { type: file.type })
    const uploadData = await pinata.upload.file(croppedFile)
    const imageUrl = `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${uploadData.IpfsHash}`

    console.log({
      name: formData.get('name'),
      price: formData.get('price'),
      description: formData.get('description'),
      image: formData.get('file'),
      cropData: formData.get('cropData'),
      type: formData.get('type'),
      sizes: formData.get('sizes')
    })
    
    const product = await prisma.product.create({
      data: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        image: imageUrl,
        type: formData.get('type') as ProductType,
        sizes: JSON.parse(formData.get('sizes') as string) as Size[],
        status: 'active'
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
} 