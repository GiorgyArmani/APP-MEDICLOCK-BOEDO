"use client"

import { useT } from "@/lib/i18n/language-provider"
import type { TPath } from "@/lib/i18n/dictionaries"

/**
 * Renders a translated string. Use inside Server Components (which can't call
 * the `useT` hook) to drop in translated text without converting the whole
 * page to a client component.
 */
export function T({ k, vars }: { k: TPath; vars?: Record<string, string | number> }) {
  const t = useT()
  return <>{t(k, vars)}</>
}
