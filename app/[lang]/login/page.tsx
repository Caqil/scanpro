// app/[lang]/login/page.tsx
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Login | ScanPro",
  description: "Log in to your ScanPro account to access PDF tools and manage your API keys.",
};

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams?: { callbackUrl?: string };
}) {
  // Check if user is already logged in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    const callbackUrl = searchParams?.callbackUrl || `/${params.lang}/dashboard`;
    redirect(callbackUrl);
  }

  return (
    <div className="container flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <LoginForm callbackUrl={searchParams?.callbackUrl} />
      </div>
    </div>
  );
}