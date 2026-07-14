"use client"

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
        "relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4",
        className,
      )}
    >
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      {children}
    </div>
  )
}
