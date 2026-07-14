"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n/language-provider";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Dynamic import to avoid server/client boundary issues if not handled by framework
    const { forgotPassword } = await import("@/lib/actions/auth");

    try {
      const result = await forgotPassword(email);

      if (result?.error) {
        throw new Error(result.error);
      }

      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("common.anErrorOccurred"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("forgotPassword.successTitle")}</CardTitle>
            <CardDescription>{t("forgotPassword.successSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("forgotPassword.successBody")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("forgotPassword.resetTitle")}</CardTitle>
            <CardDescription>
              {t("forgotPassword.resetSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("common.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("forgotPassword.emailPlaceholder")}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("forgotPassword.submitting") : t("forgotPassword.submit")}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t("common.alreadyHaveAccount")}{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4"
                >
                  {t("common.login")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
