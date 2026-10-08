"use client"

import Link from "next/link"
import Image from "next/image"
import { LanguageSwitcher } from "@/components/language-switcher"
import { cn } from "@/lib/utils"

/**
 * Shared wrapper for the auth screens: full-screen gradient background with a
 * language switcher pinned to the top-right corner.
 */
export function AuthShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative min-h-screen flex items-center justify-center bg-[#f6f7f9] px-4 pb-4 pt-20",
        className,
      )}
    >
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Image src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9" />
        <span className="text-lg font-bold tracking-tight text-slate-900">MediClock</span>
      </Link>
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      {children}
    </div>
  )
}
