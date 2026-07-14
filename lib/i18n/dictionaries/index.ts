import type { Locale } from "../config"
import { es, type Dictionary } from "./es"
import { en } from "./en"

export const dictionaries: Record<Locale, Dictionary> = { es, en }

export type { Dictionary }

/**
 * Dot-notation paths into the dictionary, e.g. "login.title".
 * Gives autocomplete and catches typos at compile time.
 */
export type TPath = DeepKeys<Dictionary>

type DeepKeys<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DeepKeys<T[K]>}`
    }[keyof T & string]
