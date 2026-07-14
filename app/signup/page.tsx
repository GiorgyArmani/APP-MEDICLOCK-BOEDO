"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { AuthShell } from "@/components/auth/auth-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useT } from "@/lib/i18n/language-provider"

export default function SignupPage() {
  const t = useT()
  return (
    <AuthShell>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("signup.title")}</CardTitle>
          <CardDescription className="text-center">{t("signup.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </AuthShell>
  )
}
