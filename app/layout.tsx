import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import FloatingChatbot from "@/components/floating-chatbot"
import { SiteHeader } from "@/components/site-header"
import { RouteTransition } from "@/components/route-transition"
import { Toaster } from "@/components/ui/toaster"
import { MotionConfig } from "framer-motion"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AI Tool Hub — One workspace for your AI workflow",
  description: "A calm, considered workspace for discovering and using AI tools.",
  applicationName: "AI Tool Hub",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <SiteHeader />
            <main className="min-h-[calc(100vh-84px)] w-full bg-background px-4 pb-10 pt-5 text-foreground sm:px-6 sm:pt-7 lg:px-8">
              <RouteTransition>{children}</RouteTransition>
            </main>
            <Toaster />
            <FloatingChatbot />
          </AuthProvider>
        </MotionConfig>
      </body>
    </html>
  )
}
