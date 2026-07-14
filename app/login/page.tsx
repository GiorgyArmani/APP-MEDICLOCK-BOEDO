"use client"

import { LoginForm } from "@/components/auth/login-form"
import { AuthShell } from "@/components/auth/auth-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useT } from "@/lib/i18n/language-provider"

export default function LoginPage() {
  const t = useT()
  return (
    <AuthShell>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("login.title")}</CardTitle>
          <CardDescription className="text-center">{t("login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </AuthShell>
  )
}
