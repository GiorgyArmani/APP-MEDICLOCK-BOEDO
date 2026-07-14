"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config"
import { dictionaries, type TPath } from "./dictionaries"

type TranslateVars = Record<string, string | number>

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (path: TPath, vars?: TranslateVars) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function resolve(dict: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key]
    return undefined
  }, dict)
  return typeof value === "string" ? value : path
}

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  )
}

function persistLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_COOKIE, locale)
  } catch {
    // localStorage may be unavailable (private mode / SSR guard)
  }
  // 1 year, so SSR can read the choice on the next request
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}

export function LanguageProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: React.ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  // On mount, prefer a previously stored choice (client-side source of truth).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_COOKIE)
      if (isLocale(stored) && stored !== locale) {
        setLocaleState(stored)
        document.documentElement.lang = stored
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
    document.documentElement.lang = next
  }, [])

  const t = useCallback(
    (path: TPath, vars?: TranslateVars) => interpolate(resolve(dictionaries[locale], path), vars),
    [locale],
  )

  const value = useMemo<LanguageContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
}

/** Convenience hook for components that only need the translate function. */
export function useT() {
  return useLanguage().t
}
