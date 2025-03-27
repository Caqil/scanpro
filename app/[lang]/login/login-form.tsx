// app/[lang]/login/login-form.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/src/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface LoginFormProps {
  callbackUrl: string;
  registered?: boolean;
}

export default function LoginForm({ 
  callbackUrl, 
  registered = false 
}: LoginFormProps) {
  const { t } = useLanguageStore();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (registered) {
      setSuccessMessage(t('login.registrationSuccess'));
    }
  }, [registered, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result?.ok) {
        setError(t('login.invalidCredentials'));
        return;
      }

      router.push(callbackUrl);
    } catch (error) {
      setError(t('login.generalError'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t('login.signIn')}</CardTitle>
        <CardDescription>
          {t('login.enterCredentials')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('login.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('login.signingIn') : t('login.signIn')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t('login.noAccount')}{" "}
          <Link href="/register" className="text-primary hover:underline">
            {t('login.signUp')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}