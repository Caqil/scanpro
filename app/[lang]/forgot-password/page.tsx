// app/[lang]/forgot-password/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | ScanPro",
  description: "Reset your password to regain access to your ScanPro account.",
};

export default async function ForgotPasswordPage({
  params,
}: {
  params: { lang: string };
}) {
  // Check if user is already logged in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect(`/${params.lang}/dashboard`);
  }

  return (
    <div className="container flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <ForgotPasswordForm lang={params.lang} />
      </div>
    </div>
  );
}