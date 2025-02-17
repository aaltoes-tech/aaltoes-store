import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    quota?: number
    active?: boolean
  }
  
  interface Session {
    user: User & {
      role?: string
      quota?: number
      active?: boolean
    }
  }
} 