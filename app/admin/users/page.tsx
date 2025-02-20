import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Navbar from "@/app/components/Navbar"
import { UserTable } from "../components/UserTable"

async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "Admin") {
    redirect("/")
  }

  const users = await getUsers()

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center space-y-4 mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        </div>
        <UserTable users={users} />
      </main>
    </>
  )
} 