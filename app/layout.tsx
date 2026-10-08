import type React from "react"
import type { Metadata } from "next"
import { Figtree, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { cookies } from "next/headers"
import { LanguageProvider } from "@/lib/i18n/language-provider"
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/config"
import "./globals.css"

// Humanist sans used across the app and the landing (healthcare, legible at small sizes).
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Medi Clock - Gestión de Guardias Médicas",
  description: "Gestiona las guardias médicas con control de acceso basado en roles",
  generator: "Next.js",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

import { Toaster } from "sonner"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${figtree.variable} ${geistMono.variable} font-sans antialiased`}>
        <LanguageProvider initialLocale={locale}>
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
