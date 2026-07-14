"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthShell } from "@/components/auth/auth-shell"
import Link from "next/link"
import { Mail } from "lucide-react"
import { useT } from "@/lib/i18n/language-provider"

export default function SignupSuccessPage() {
    const t = useT()
    return (
        <AuthShell>
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-4">
                    <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                        <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{t("signupVerification.title")}</CardTitle>
                    <CardDescription className="text-lg">
                        {t("signupVerification.subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg text-sm text-muted-foreground">
                        <p>{t("signupVerification.body")}</p>
                    </div>

                    <Button asChild className="w-full" variant="outline">
                        <Link href="/login">
                            {t("common.backToLogin")}
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </AuthShell>
    )
}
