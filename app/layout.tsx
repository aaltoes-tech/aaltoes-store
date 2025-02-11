import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css"


export const metadata: Metadata = {
  title: "Aaltoes Shop",
  description: "Aaltoes Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} font-sans dark`}>
      <body className={GeistSans.className}>
        {children}
      </body>
    </html>
  );
}
