import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL!

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString
    }
  }
})

const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
