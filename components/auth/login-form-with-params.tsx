"use client";

import { useSearchParams } from "next/navigation";
import { LoginForm } from "./login-form";

export function LoginFormWithParams() {
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl");
  
  // Validate the callbackUrl to ensure it's a relative path
  const callbackUrl = callbackUrlParam && callbackUrlParam.startsWith("/en/")
    ? callbackUrlParam
    : "/en/dashboard";
  
  return <LoginForm callbackUrl={callbackUrl} />;
}