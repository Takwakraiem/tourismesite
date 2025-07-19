import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Polyglotte Tourism - Découvrez le Maghreb",
  description: "Application PWA pour découvrir la Tunisie, le Maroc et le Maghreb avec nos guides experts",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Polyglotte Tourism",
  },
    generator: 'v0.dev'
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        


        <link rel="icon" href="/logo.jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Polyglotte Tourism" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
