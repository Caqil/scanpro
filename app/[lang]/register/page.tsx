// app/[lang]/register/page.tsx
import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Register | ScanPro",
  description: "Create a new account to use ScanPro's PDF tools and developer API.",
};

export default async function RegisterPage() {
  // Check if user is already logged in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    const callbackUrl = `/en/dashboard`;
    redirect(callbackUrl);
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side - Branding and info */}
      <div className="hidden md:flex flex-col w-1/2 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-8 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <SiteLogo size={36} />
            <span className="font-bold text-3xl">ScanPro</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">Join our community</h1>
          <p className="text-xl mb-4">Create an account to access all of our powerful PDF tools.</p>
          <p className="text-lg opacity-90">Whether you need to convert, edit, merge, or secure your documents, we've got you covered.</p>
          
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <div className="rounded-full h-8 w-8 bg-white/20 flex items-center justify-center text-white mt-1">✓</div>
              <div>
                <p className="font-medium">Convert PDF files</p>
                <p className="text-sm opacity-80">To Word, Excel, PowerPoint & more</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="rounded-full h-8 w-8 bg-white/20 flex items-center justify-center text-white mt-1">✓</div>
              <div>
                <p className="font-medium">Edit PDFs easily</p>
                <p className="text-sm opacity-80">Add text, images, and signatures</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="rounded-full h-8 w-8 bg-white/20 flex items-center justify-center text-white mt-1">✓</div>
              <div>
                <p className="font-medium">Protect your files</p>
                <p className="text-sm opacity-80">Add passwords and encryption</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="rounded-full h-8 w-8 bg-white/20 flex items-center justify-center text-white mt-1">✓</div>
              <div>
                <p className="font-medium">Developer API</p>
                <p className="text-sm opacity-80">Access tools programmatically</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm opacity-80">© 2025 ScanPro. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right side - Register form */}
      <div className="flex flex-col w-full md:w-1/2 p-6 sm:p-10 justify-center items-center">
        <div className="md:hidden flex items-center gap-2 mb-10">
          <SiteLogo size={30} />
          <span className="font-bold text-2xl">ScanPro</span>
        </div>
        
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-center">Create your account</h2>
            <p className="text-muted-foreground text-center mt-2">
              Start managing your documents like a professional
            </p>
          </div>
          
          <RegisterForm />
          
          <p className="text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        
        <div className="md:hidden text-center mt-10 text-sm text-muted-foreground">
          © 2025 ScanPro. All rights reserved.
        </div>
      </div>
    </div>
  );
}