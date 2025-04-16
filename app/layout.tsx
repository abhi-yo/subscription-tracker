import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { NextAuthProvider } from "@/lib/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "sub* - Track Subscriptions, Save Money",
  description:
    "Automatically detect subscriptions from your Gmail inbox, organize spending data, and receive monthly summaries to control your recurring expenses.",
  metadataBase: new URL('https://subscription-tracker.vercel.app'),
  openGraph: {
    title: "sub* - Track Subscriptions, Save Money",
    description: "Automatically detect subscriptions from your Gmail inbox and save money",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'sub* - Subscription Tracker',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "sub* - Track Subscriptions, Save Money",
    description: "Automatically detect subscriptions from your Gmail inbox and save money",
    images: ['/images/og-image.jpg'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}