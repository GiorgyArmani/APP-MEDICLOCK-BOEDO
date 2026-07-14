"use client"

import { useState } from "react"
import { signUp } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useT } from "@/lib/i18n/language-provider"

export function HonorariosSignupForm() {
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
            role: "honorarios",
        })

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <form action={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">{t("honorariosSignup.fullName")}</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    placeholder={t("honorariosSignup.fullNamePlaceholder")}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t("honorariosSignup.phoneNumber")}</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder={t("honorariosSignup.phonePlaceholder")}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">{t("honorariosSignup.emailLabel")}</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("honorariosSignup.emailPlaceholder")}
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
                <p className="text-xs text-muted-foreground">{t("honorariosSignup.passwordHint")}</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
                {isLoading ? t("honorariosSignup.submitting") : t("honorariosSignup.submit")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                {t("common.alreadyHaveAccount")}{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                    {t("honorariosSignup.signIn")}
                </Link>
            </p>
        </form>
    )
}
