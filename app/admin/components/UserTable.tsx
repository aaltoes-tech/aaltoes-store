"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "@geist-ui/icons"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { User } from "@prisma/client"

interface UserTableProps {
  users: User[]
}

const ROLES = ["User", "Admin"] as const
type Role = typeof ROLES[number]


export function UserTable({ users: initialUsers }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleSearch = (value: string) => {
    const filtered = initialUsers.filter(user => 
      user.name?.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    )
    setUsers(filtered)
  }

  async function updateUserRole({ id, role }: { id: string, role: Role }) {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    })

    if (!res.ok) throw new Error()
  }

  async function handleRoleUpdate(userId: string, newRole: Role) {
    try {
      await updateUserRole({ id: userId, role: newRole })

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))

      toast({
        description: "User role updated successfully"
      })
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to update user role"
      })
    }
  }

  return (
    <div className="mb-8">
      
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="relative w-[100%] mb-4">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
          />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleSearch(e.target.value)
            }}
          />
        </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-muted-foreground">
            No users found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback>
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleUpdate(user.id, value as Role)}
                        disabled={user.id === session?.user?.id}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 