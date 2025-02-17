import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google'
import prisma from "./prisma";
import NextAuth from "next-auth"

export const authConfig: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  theme: {
    brandColor: "#000000",
    logo: "/aaltoes.svg",
    buttonText: "#FFFFFF",
    colorScheme: "auto"
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.role = user.role;
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}; 