// app/[lang]/register/page.tsx
import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Register | ScanPro",
  description: "Create a new account to use ScanPro's PDF tools and developer API.",
};

export default async function RegisterPage({
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
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Register to access advanced PDF tools and developer API
          </p>
        </div>
        <RegisterForm callbackUrl={searchParams?.callbackUrl} lang={params.lang} />
      </div>
    </div>
  );
}