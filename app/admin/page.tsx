import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getProducts, getUsers } from "./actions"
import { AdminClient } from "./AdminClient"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "Admin") {
    redirect("/")
  }

  const [products, users] = await Promise.all([
    getProducts(),
    getUsers()
  ])

  return <AdminClient initialProducts={products} initialUsers={users} />
} 