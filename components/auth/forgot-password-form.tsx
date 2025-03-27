"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle, MailIcon } from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  lang?: string;
}

export function ForgotPasswordForm({ lang }: ForgotPasswordFormProps) {
  const { t } = useLanguageStore();
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState("");
  
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Validate email format
  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError(t('auth.emailRequired') || "Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      setEmailError(t('auth.invalidEmail') || "Please enter a valid email address");
    } else {
      setEmailError(null);
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate email
    if (!validateEmail(email)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the password reset API
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t('auth.resetPasswordError') || "Failed to send reset email");
      }
      
      // Show success message
      setEmailSent(true);
      toast.success(t('auth.resetEmailSent') || "Password reset email sent");
    } catch (error) {
      // We don't show the exact error for security reasons
      // Just tell the user that if the email exists, they'll receive instructions
      setEmailSent(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle going back to login
  const handleBackToLogin = () => {
    router.push(`/${lang || 'en'}/login`);
  };
  
  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">{t('auth.checkYourEmail') || "Check your email"}</h2>
        </div>
        
        <p className="text-muted-foreground">
          {t('auth.resetInstructions') || "If an account exists with that email, we've sent instructions to reset your password."}
        </p>
        
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            {t('auth.didntReceiveEmail') || "Didn't receive an email?"} {" "}
            <button 
              type="button" 
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="text-primary underline hover:text-primary/90"
            >
              {t('auth.tryAgain') || "Try again"}
            </button>
          </p>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleBackToLogin}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('auth.backToLogin') || "Back to login"}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <MailIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="mt-3 text-xl font-semibold">
          {t('auth.forgotPassword') || "Forgot your password?"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('auth.forgotInstructions') || "Enter your email and we'll send you instructions to reset your password."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            {t('auth.email') || "Email"}
            {emailError && (
              <span className="ml-2 text-xs text-destructive font-normal">
                {emailError}
              </span>
            )}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth.emailPlaceholder') || "name@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? "border-destructive" : ""}
            disabled={loading}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
              {t('auth.sending') || "Sending..."}
            </>
          ) : (
            t('auth.sendResetLink') || "Send Reset Link"
          )}
        </Button>
      </form>
      
      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBackToLogin}
          className="text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('auth.backToLogin') || "Back to login"}
        </Button>
      </div>
    </div>
  );
}