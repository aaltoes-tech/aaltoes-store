"use client"

import { AddProductForm } from "../components/AddProductForm"
import { useRouter } from "next/navigation"
import Navbar from "@/app/components/Navbar"
import { ArrowLeft } from "@geist-ui/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function AddProductPage() {
  const router = useRouter()

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        </div>
        <div className="flex  mb-8">
          <Link
            href="/admin"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-muted-foreground"
            )}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Admin
          </Link>
        </div>
        <AddProductForm 
          onClose={() => router.push("/admin")}
          onSuccess={() => router.push("/admin")}
        />
      </main>
    </>
  )
} 