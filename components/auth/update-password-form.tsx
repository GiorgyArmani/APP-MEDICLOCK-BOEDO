"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/language-provider";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useT();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();

  // Check for recovery session on mount
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();

      // Extract tokens from hash if present
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      console.log('🔐 Password reset page loaded', { hasAccessToken: !!accessToken, type });

      // If we have tokens in the hash, set the session
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error);
          setError(t("updatePassword.invalidLink"));
          setSessionChecked(true);
          return;
        }

        // Clear the hash from URL for security
        window.history.replaceState(null, '', window.location.pathname);
      }

      // Verify we have a valid session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError(t("updatePassword.noSession"));
      } else {
        console.log('✅ Valid session found for password reset');
      }

      setSessionChecked(true);
    };

    checkSession();
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t("updatePassword.passwordsDoNotMatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("updatePassword.passwordTooShort"));
      return;
    }

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      console.log('✅ Password updated successfully');
      toast.success(t("updatePassword.success"));

      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error: unknown) {
      console.error('❌ Password update error:', error);
      setError(error instanceof Error ? error.message : t("updatePassword.updateError"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{t("updatePassword.verifying")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("updatePassword.title")}</CardTitle>
          <CardDescription>
            {t("updatePassword.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">{t("updatePassword.newPassword")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("updatePassword.newPasswordPlaceholder")}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!!error}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">{t("updatePassword.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("updatePassword.confirmPasswordPlaceholder")}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!!error}
                />
              </div>
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading || !!error}>
                {isLoading ? t("updatePassword.submitting") : t("updatePassword.submit")}
              </Button>
              {error && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/auth/forgot-password")}
                >
                  {t("updatePassword.requestNewLink")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
