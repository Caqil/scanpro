// app/[lang]/api-docs/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "API Documentation | ScanPro",
  description: "Learn how to use the ScanPro API to integrate our PDF tools into your applications.",
};

export default function ApiDocsPage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-xl text-muted-foreground mt-4">
            Learn how to integrate ScanPro's powerful PDF tools into your applications
          </p>
          <div className="mt-6">
            <Link href="/validate-purchase">
              <Button>Validate Your Purchase</Button>
            </Link>
          </div>
        </div>

        {/* Getting Started Section */}
        <section id="getting-started" className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Getting Started</h2>
          <p className="text-muted-foreground">
            To use the ScanPro API, you need to have a valid purchase code from CodeCanyon.
            If you've already purchased ScanPro, you can
            <Link href="/validate-purchase" className="text-primary mx-1 hover:underline">
              validate your purchase code
            </Link>
            to get your API key.
          </p>

          <div className="flex flex-col md:flex-row gap-6 mt-6">
            <div className="flex-1 border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">1. Purchase ScanPro</h3>
              <p className="text-sm text-muted-foreground">
                Buy ScanPro from CodeCanyon to get your purchase code
              </p>
            </div>
            <div className="flex-1 border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">2. Validate Your Purchase</h3>
              <p className="text-sm text-muted-foreground">
                Enter your purchase code to generate your API key
              </p>
            </div>
            <div className="flex-1 border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">3. Start Using the API</h3>
              <p className="text-sm text-muted-foreground">
                Integrate ScanPro's features into your applications
              </p>
            </div>
          </div>
        </section>

        {/* Authentication Section */}
        <section id="authentication" className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Authentication</h2>
          <p className="text-muted-foreground">
            All API requests require authentication using an API key. You can generate your API key by validating your purchase code.
          </p>

          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-semibold">API Key Authentication</h3>
            <p>There are two ways to pass your API key with each request:</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium">HTTP Header (Recommended)</h4>
                <div className="bg-muted/20 p-4 rounded-md">
                  <pre><code>x-api-key: your_api_key_here</code></pre>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Query Parameter</h4>
                <div className="bg-muted/20 p-4 rounded-md">
                  <pre><code>https://your-domain.com/api/endpoint?api_key=your_api_key_here</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Endpoints Section */}
        <section id="endpoints" className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">API Endpoints</h2>
          
          <div className="border rounded-lg overflow-hidden">
            {/* Convert PDF */}
            <div className="border-b">
              <div className="bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs font-mono">POST</span>
                  <span className="font-mono">/api/convert</span>
                </div>
                <h3 className="font-medium mt-2">Convert PDF to Various Formats</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Request Format</h4>
                  <div className="bg-muted/20 p-4 rounded-md mt-2">
                    <pre className="text-sm overflow-x-auto">
<code>{`{
  "file": "base64_encoded_file_data",
  "outputFormat": "docx", // docx, xlsx, jpg, png, etc.
  "ocr": false, // optional
  "quality": 90 // optional, for image outputs
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Response Format</h4>
                  <div className="bg-muted/20 p-4 rounded-md mt-2">
                    <pre className="text-sm overflow-x-auto">
<code>{`{
  "success": true,
  "message": "Conversion successful",
  "fileUrl": "https://your-domain.com/conversions/123456-output.docx",
  "filename": "123456-output.docx"
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Example</h4>
                  <div className="bg-muted/20 p-4 rounded-md mt-2">
                    <pre className="text-sm overflow-x-auto">
<code>{`curl -X POST https://your-domain.com/api/convert \\
  -H "x-api-key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "file": "JVBERi0xLjUKJYCBgoMKMSAwIG9iago8PC9GaWx0...",
    "outputFormat": "docx"
  }'`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Compress PDF */}
            <div className="border-b">
              <div className="bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs font-mono">POST</span>
                  <span className="font-mono">/api/compress</span>
                </div>
                <h3 className="font-medium mt-2">Compress PDF Files</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Request Format</h4>
                  <div className="bg-muted/20 p-4 rounded-md mt-2">
                    <pre className="text-sm overflow-x-auto">
<code>{`{
  "file": "base64_encoded_file_data",
  "quality": "medium" // low, medium, high
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Response Format</h4>
                  <div className="bg-muted/20 p-4 rounded-md mt-2">
                    <pre className="text-sm overflow-x-auto">
<code>{`{
  "success": true,
  "message": "PDF compression successful",
  "fileUrl": "https://your-domain.com/compressions/123456-compressed.pdf",
  "filename": "123456-compressed.pdf",
  "originalSize": 1048576,
  "compressedSize": 524288,
  "compressionRatio": "50%"
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Merge PDFs */}
            <div className="border-b">
              <div className="bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs font-mono">POST</span>
                  <span className="font-mono">/api/merge</span>
                </div>
                <h3 className="font-medium mt-2">Merge Multiple PDF Files</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Request Format</h4>
                  <div className="bg-muted/20 p-4 rounded-md mt-2">
                    <pre className="text-sm overflow-x-auto">
<code>{`{
  "files": [
    "base64_encoded_file_data_1",
    "base64_encoded_file_data_2",
    ...
  ],
  "order": [0, 1, 2] // optional, file indices in order
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Response Format</h4>
                  <div className="bg-muted/20 p-4 rounded-md mt-2">
                    <pre className="text-sm overflow-x-auto">
<code>{`{
  "success": true,
  "message": "PDF merge successful",
  "fileUrl": "https://your-domain.com/merges/123456-merged.pdf",
  "filename": "123456-merged.pdf"
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling Section */}
        <section id="errors" className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Error Handling</h2>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The API returns standard HTTP status codes along with JSON error responses.
            </p>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 p-4 bg-muted/20 font-medium">
                <div className="col-span-2">Status Code</div>
                <div className="col-span-3">Error Type</div>
                <div className="col-span-7">Description</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-12 p-4">
                  <div className="col-span-2 font-mono">400</div>
                  <div className="col-span-3">Bad Request</div>
                  <div className="col-span-7 text-muted-foreground text-sm">The request was malformed or missing required parameters</div>
                </div>
                <div className="grid grid-cols-12 p-4">
                  <div className="col-span-2 font-mono">401</div>
                  <div className="col-span-3">Unauthorized</div>
                  <div className="col-span-7 text-muted-foreground text-sm">Invalid or missing API key</div>
                </div>
                <div className="grid grid-cols-12 p-4">
                  <div className="col-span-2 font-mono">429</div>
                  <div className="col-span-3">Too Many Requests</div>
                  <div className="col-span-7 text-muted-foreground text-sm">Rate limit exceeded</div>
                </div>
                <div className="grid grid-cols-12 p-4">
                  <div className="col-span-2 font-mono">500</div>
                  <div className="col-span-3">Server Error</div>
                  <div className="col-span-7 text-muted-foreground text-sm">An error occurred while processing the request</div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mt-6">Error Response Format</h3>
            <div className="bg-muted/20 p-4 rounded-md mt-2">
              <pre className="text-sm overflow-x-auto">
<code>{`{
  "success": false,
  "message": "Error message describing what went wrong"
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Purchase Validation Section */}
        <section id="purchase-validation" className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Purchase Validation</h2>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              To use the ScanPro API, you need to validate your purchase code from CodeCanyon.
              This is a one-time process that generates your API key.
            </p>
            
            <div className="bg-muted/20 p-6 rounded-lg space-y-4">
              <h3 className="font-medium">Steps to validate your purchase:</h3>
              <ol className="list-decimal ml-6 space-y-2 text-sm">
                <li>Purchase ScanPro from CodeCanyon</li>
                <li>Go to your Envato downloads page and locate your purchase code</li>
                <li>Visit the <Link href="/validate-purchase" className="text-primary hover:underline">Purchase Validation</Link> page</li>
                <li>Enter your purchase code and email</li>
                <li>Get your API key and start using the API</li>
              </ol>
              
              <div className="mt-4 p-4 border bg-background rounded-md">
                <h4 className="text-sm font-medium mb-2">Important Notes:</h4>
                <ul className="list-disc ml-5 text-xs text-muted-foreground space-y-1">
                  <li>Each purchase code can be used to generate only one API key</li>
                  <li>Keep your API key secure and don't share it with others</li>
                  <li>If you lose your API key, you can retrieve it by validating your purchase code again with the same email</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}