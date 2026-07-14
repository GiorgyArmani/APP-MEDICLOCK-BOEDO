"use client"

import { useState } from "react"
import { signUp } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useT } from "@/lib/i18n/language-provider"

export function SignupForm() {
  const t = useT()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const phoneNumber = formData.get("phoneNumber") as string

    const result = await signUp({
      email,
      password,
      fullName,
      phoneNumber,
      role: "doctor",
    })

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // If successful, signUp will redirect to dashboard
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t("signup.fullName")}</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder={t("signup.fullNamePlaceholder")}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">{t("signup.phoneNumber")}</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder={t("signup.phonePlaceholder")}
          required
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">{t("signup.phoneHint")}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("common.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("signup.emailPlaceholder")}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("common.password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
          minLength={6}
        />
        <p className="text-xs text-muted-foreground">{t("signup.passwordHint")}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("signup.submitting") : t("signup.submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("common.alreadyHaveAccount")}{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          {t("signup.signIn")}
        </Link>
      </p>
    </form>
  )
}
