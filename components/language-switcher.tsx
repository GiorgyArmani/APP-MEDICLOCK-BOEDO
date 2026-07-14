"use client"

import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales, localeNames } from "@/lib/i18n/config"
import { useLanguage } from "@/lib/i18n/language-provider"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2 text-muted-foreground", className)}
          aria-label={t("languageSwitcher.label")}
        >
          <Globe className="h-4 w-4" />
          <span className="uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLocale(code)}
            className="flex items-center justify-between gap-6"
          >
            {localeNames[code]}
            {locale === code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
