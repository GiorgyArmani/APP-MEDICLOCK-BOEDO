"use client"

import { HonorariosSignupForm } from "@/components/auth/honorarios-signup-form"
import { AuthShell } from "@/components/auth/auth-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck } from "lucide-react"
import { useT } from "@/lib/i18n/language-provider"

export default function HonorariosSignupPage() {
    const t = useT()
    return (
        <AuthShell className="bg-gradient-to-br from-slate-50 to-blue-50">
            <Card className="w-full max-w-md shadow-xl border-slate-200/60">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-slate-900 rounded-2xl">
                            <ClipboardCheck className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900">{t("honorariosSignup.title")}</CardTitle>
                    <CardDescription className="font-medium text-slate-500">
                        {t("honorariosSignup.subtitle")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <HonorariosSignupForm />
                </CardContent>
            </Card>
        </AuthShell>
    )
}
