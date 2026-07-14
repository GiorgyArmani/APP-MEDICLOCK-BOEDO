import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { cookies } from "next/headers"
import { LanguageProvider } from "@/lib/i18n/language-provider"
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/config"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
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
    icon: "/logo.png",
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <LanguageProvider initialLocale={locale}>
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
