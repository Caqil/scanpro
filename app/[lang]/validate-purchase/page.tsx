// app/[lang]/validate-purchase/page.tsx
import { Metadata } from "next";
import { PurchaseCodeForm } from "@/components/purchase-code-form";

export const metadata: Metadata = {
  title: "Validate Your Purchase | ScanPro",
  description: "Enter your CodeCanyon purchase code to validate your purchase and get your API key.",
};

export default function ValidatePurchasePage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Validate Your Purchase
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Enter your CodeCanyon purchase code to activate your product and get your API key
          </p>
        </div>
        
        <div className="flex justify-center">
          <PurchaseCodeForm />
        </div>
        
        <div className="bg-muted/20 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">How to find your purchase code</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>Log in to your Envato account (CodeCanyon)</li>
            <li>Go to your <strong>Downloads</strong> page</li>
            <li>Find ScanPro in your purchases list</li>
            <li>Click on the <strong>Download</strong> button and select <strong>License Certificate & Purchase Code</strong></li>
            <li>Open the downloaded file to find your purchase code</li>
          </ol>
          
          <div className="mt-6 p-4 border rounded bg-background">
            <h3 className="font-medium text-sm">Example Purchase Code Format:</h3>
            <code className="text-sm">5cb8e278-a516-48ee-9d41-95a91c3f5aa3</code>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Need help?</h3>
            <p className="text-sm text-muted-foreground">
              If you're having trouble finding your purchase code or validating your purchase,
              please contact our support team at <a href="mailto:support@scanpro.example.com" className="text-primary hover:underline">support@scanpro.example.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}