import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "처갓집양념치킨 왕십리점 - 주문하기",
  description: "맛있는 치킨을 주문하세요",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="max-w-md mx-auto bg-white min-h-screen">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  )
}
