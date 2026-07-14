export const locales = ["es", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "es"

export const LOCALE_COOKIE = "locale"

export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
}

/** BCP-47 tags for Intl APIs (toLocaleDateString, etc.). */
export const intlLocales: Record<Locale, string> = {
  es: "es-ES",
  en: "en-US",
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value)
}
