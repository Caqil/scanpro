"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useLanguageStore } from "@/src/store/store";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginFormProps {
  callbackUrl?: string;
  lang?: string;
}

export function LoginForm({ callbackUrl, lang }: LoginFormProps) {
  const { t } = useLanguageStore();
  const router = useRouter();
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
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
  
  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate email
    if (!validateEmail(email)) {
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError(t('auth.passwordRequired') || "Password is required");
      isValid = false;
    } else {
      setPasswordError(null);
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError(t('auth.invalidCredentials') || "Invalid email or password");
        return;
      }
      
      // Show success toast
      toast.success(t('auth.loginSuccess') || "Signed in successfully");
      
      // Redirect to dashboard or intended destination
      const redirectUrl = callbackUrl || `/${lang || 'en'}/dashboard`;
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      setError(t('auth.loginError') || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleOAuthSignIn = (provider: string) => {
    const redirectUrl = callbackUrl || `/${lang || 'en'}/dashboard`;
    signIn(provider, { callbackUrl: redirectUrl });
  };
  
  return (
    <div className="space-y-6">
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
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="flex items-center">
              {t('auth.password') || "Password"}
              {passwordError && (
                <span className="ml-2 text-xs text-destructive font-normal">
                  {passwordError}
                </span>
              )}
            </Label>
            <a 
              href={`/${lang || 'en'}/forgot-password`} 
              className="text-sm text-primary hover:underline"
            >
              {t('auth.forgotPassword') || "Forgot password?"}
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? "border-destructive pr-10" : "pr-10"}
              disabled={loading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember-me" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <label
            htmlFor="remember-me"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            {t('auth.rememberMe') || "Remember me"}
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
              {t('auth.signingIn') || "Signing in..."}
            </>
          ) : (
            t('auth.signIn') || "Sign In"
          )}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('auth.orContinueWith') || "Or continue with"}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => handleOAuthSignIn("google")}
          disabled={loading}
        >
          <svg 
            viewBox="0 0 24 24"
            width="16"
            height="16"
            className="mr-2 h-4 w-4"
          >
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path
                fill="#4285F4"
                d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
              />
              <path
                fill="#34A853"
                d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
              />
              <path
                fill="#FBBC05"
                d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
              />
              <path
                fill="#EA4335"
                d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
              />
            </g>
          </svg>
          Google
        </Button>
        
        <Button
          variant="outline"
          type="button"
          onClick={() => handleOAuthSignIn("github")}
          disabled={loading}
        >
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
      
      <div className="text-center text-sm">
        {t('auth.dontHaveAccount') || "Don't have an account?"}{" "}
        <a href={`/${lang || 'en'}/register`} className="text-primary hover:underline">
          {t('auth.signUp') || "Sign up"}
        </a>
      </div>
    </div>
  );
}