"use client"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthShell } from "@/components/auth/auth-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useT } from "@/lib/i18n/language-provider"

export default function ForgotPasswordPage() {
    const t = useT()
    return (
        <AuthShell>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">{t("forgotPassword.title")}</CardTitle>
                    <CardDescription className="text-center">
                        {t("forgotPassword.subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm />
                </CardContent>
            </Card>
        </AuthShell>
    )
}
