"use client";

import { useSearchParams } from "next/navigation";
import { LoginForm } from "./login-form";

export function LoginFormWithParams() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/en/dashboard";
  
  return <LoginForm callbackUrl={callbackUrl} />;
}