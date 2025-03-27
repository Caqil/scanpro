// app/[lang]/developer/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Documentation | ScanPro",
  description: "Comprehensive documentation for the ScanPro API"
};

export default async function DeveloperPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/developer");
  }
  
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-2">ScanPro API Documentation</h1>
      <p className="text-muted-foreground mb-6">
        Integrate ScanPro's powerful PDF tools into your applications
      </p>
      
      <div className="flex justify-end mb-6">
        <Link href="/dashboard?tab=api-keys">
          <Button>Manage API Keys</Button>
        </Link>
      </div>
      
      <Tabs defaultValue="getting-started">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="sdk">SDKs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="getting-started" className="py-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Getting Started</h2>
            <p>
              Welcome to the ScanPro API documentation. This guide will help you 
              integrate ScanPro's document processing capabilities into your own 
              applications.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Prerequisites</h3>
              <p>To use the ScanPro API, you need:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>An active ScanPro account</li>
                <li>At least one API key</li>
                <li>A subscription plan that covers your usage needs</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Quick Start</h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Create an API key</strong> - Go to your 
                  <Link href="/dashboard?tab=api-keys" className="text-primary mx-1 hover:underline">
                    dashboard
                  </Link>
                  and create a new API key.
                </li>
                <li>
                  <strong>Make your first API call</strong> - Use your API key to authenticate 
                  and make requests to our endpoints.
                </li>
                <li>
                  <strong>Handle the response</strong> - Process the API response in your application.
                </li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Example Request</h3>
              <div className="bg-muted/20 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
<code>{`curl -X POST https://api.scanpro.cc/api/convert \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@document.pdf" \\
  -F "outputFormat=docx"
`}</code>
                </pre>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="authentication" className="py-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Authentication</h2>
            <p>
              All API requests to ScanPro require authentication. You must include your API key
              with each request to authenticate your application.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">API Keys</h3>
              <p>
                API keys are unique identifiers that authenticate your requests to the ScanPro API.
                Your API keys carry many privileges, so be sure to keep them secure!
              </p>
              <p>
                You can manage your API keys from your 
                <Link href="/dashboard?tab=api-keys" className="text-primary mx-1 hover:underline">
                  dashboard
                </Link>.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Authentication Methods</h3>
              <p>There are two ways to authenticate your API requests:</p>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="font-medium">HTTP Header (Recommended)</h4>
                  <div className="bg-muted/20 p-4 rounded-md">
                    <pre><code>x-api-key: your_api_key_here</code></pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Query Parameter</h4>
                  <div className="bg-muted/20 p-4 rounded-md">
                    <pre><code>https://api.scanpro.cc/api/convert?api_key=your_api_key_here</code></pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Security Best Practices</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Never share your API keys in publicly accessible areas like GitHub, client-side code, etc.</li>
                <li>Use different API keys for different environments (development, staging, production)</li>
                <li>Regularly rotate your API keys to limit the risk if they are compromised</li>
                <li>Only grant necessary permissions to each key</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="endpoints" className="py-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">API Endpoints</h2>
            <p>
              ScanPro provides a variety of endpoints for document processing operations.
              All endpoints are accessible at <code>https://api.scanpro.cc/api</code>.
            </p>
            
            <div className="border rounded-lg overflow-hidden">
              {/* Convert PDF */}
              <div className="border-b">
                <div className="bg-muted/20 p-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs font-mono">POST</span>
                    <span className="font-mono">/convert</span>
                  </div>
                  <h3 className="font-medium mt-2">Convert PDF to Various Formats</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Request Format</h4>
                    <p className="text-sm text-muted-foreground mb-2">Multipart form data:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li><code>file</code> - The PDF file to convert</li>
                      <li><code>outputFormat</code> - Format to convert to (docx, xlsx, jpg, png, etc.)</li>
                      <li><code>ocr</code> - (Optional) Enable OCR for text extraction (true/false)</li>
                      <li><code>quality</code> - (Optional) Image quality for image outputs (1-100)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Response Format</h4>
                    <div className="bg-muted/20 p-4 rounded-md mt-2">
                      <pre className="text-sm overflow-x-auto">
<code>{`{
  "success": true,
  "message": "Conversion successful",
  "fileUrl": "https://api.scanpro.cc/files/conversions/123456-output.docx",
  "filename": "123456-output.docx"
}`}</code>
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Example</h4>
                    <div className="bg-muted/20 p-4 rounded-md mt-2">
                      <pre className="text-sm overflow-x-auto">
<code>{`curl -X POST https://api.scanpro.cc/api/convert \\
  -H "x-api-key: your_api_key_here" \\
  -F "file=@document.pdf" \\
  -F "outputFormat=docx"`}</code>
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
                    <span className="font-mono">/compress</span>
                  </div>
                  <h3 className="font-medium mt-2">Compress PDF Files</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Request Format</h4>
                    <p className="text-sm text-muted-foreground mb-2">Multipart form data:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li><code>file</code> - The PDF file to compress</li>
                      <li><code>quality</code> - (Optional) Compression level (low, medium, high)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Response Format</h4>
                    <div className="bg-muted/20 p-4 rounded-md mt-2">
                      <pre className="text-sm overflow-x-auto">
<code>{`{
  "success": true,
  "message": "PDF compression successful",
  "fileUrl": "https://api.scanpro.cc/files/compressions/123456-compressed.pdf",
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
                    <span className="font-mono">/merge</span>
                  </div>
                  <h3 className="font-medium mt-2">Merge Multiple PDF Files</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Request Format</h4>
                    <p className="text-sm text-muted-foreground mb-2">Multipart form data:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li><code>files[]</code> - Multiple PDF files to merge</li>
                      <li><code>order</code> - (Optional) JSON array of file indices specifying order</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Response Format</h4>
                    <div className="bg-muted/20 p-4 rounded-md mt-2">
                      <pre className="text-sm overflow-x-auto">
<code>{`{
  "success": true,
  "message": "PDF merge successful",
  "fileUrl": "https://api.scanpro.cc/files/merges/123456-merged.pdf",
  "filename": "123456-merged.pdf"
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Split PDF */}
              <div>
                <div className="bg-muted/20 p-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs font-mono">POST</span>
                    <span className="font-mono">/split</span>
                  </div>
                  <h3 className="font-medium mt-2">Split PDF into Multiple Files</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Request Format</h4>
                    <p className="text-sm text-muted-foreground mb-2">Multipart form data:</p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li><code>file</code> - The PDF file to split</li>
                      <li><code>splitMethod</code> - Method for splitting (range, extract, every)</li>
                      <li><code>pageRanges</code> - (Optional) Range of pages to extract (e.g., "1-3,5,7-9")</li>
                      <li><code>everyNPages</code> - (Optional) Number of pages per split document</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Response Format</h4>
                    <div className="bg-muted/20 p-4 rounded-md mt-2">
                      <pre className="text-sm overflow-x-auto">
<code>{`{
  "success": true,
  "message": "PDF split into 3 files",
  "originalName": "document.pdf",
  "totalPages": 10,
  "splitParts": [
    {
      "fileUrl": "/splits/123456-split-1.pdf",
      "filename": "123456-split-1.pdf",
      "pages": [1, 2, 3],
      "pageCount": 3
    },
    // Additional parts...
  ]
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                For a complete list of available endpoints and detailed request/response formats,
                refer to our comprehensive 
                <Link href="/developer/api-reference" className="text-primary mx-1 hover:underline">
                  API Reference
                </Link>.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rate-limits" className="py-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Rate Limits & Usage</h2>
            <p>
              ScanPro implements rate limiting to ensure fair usage of our API and maintain 
              service stability. The limits vary based on your subscription tier.
            </p>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/20 p-4 font-medium">
                <div className="grid grid-cols-4 gap-4">
                  <div>Plan</div>
                  <div>Rate Limit</div>
                  <div>Monthly Operations</div>
                  <div>Max API Keys</div>
                </div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div>Free</div>
                  <div>10 requests / hour</div>
                  <div>100 operations</div>
                  <div>1</div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div>Basic</div>
                  <div>100 requests / hour</div>
                  <div>1,000 operations</div>
                  <div>3</div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div>Pro</div>
                  <div>1,000 requests / hour</div>
                  <div>10,000 operations</div>
                  <div>10</div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div>Enterprise</div>
                  <div>5,000 requests / hour</div>
                  <div>100,000 operations</div>
                  <div>50</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Rate Limit Headers</h3>
              <p>
                All API responses include headers that provide information about your current rate limit status:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><code>X-RateLimit-Limit</code>: The maximum number of requests allowed per hour</li>
                <li><code>X-RateLimit-Remaining</code>: The number of requests remaining in the current window</li>
                <li><code>X-RateLimit-Reset</code>: The time at which the current rate limit window resets (UTC)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Handling Rate Limits</h3>
              <p>
                If you exceed your rate limit, the API will respond with a <code>429 Too Many Requests</code> 
                status code. In this case, you should:
              </p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Check the <code>X-RateLimit-Reset</code> header to see when the limit will reset</li>
                <li>Implement exponential backoff in your client to handle retries</li>
                <li>Consider upgrading your plan if you consistently hit rate limits</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Monitoring Usage</h3>
              <p>
                You can monitor your API usage in the 
                <Link href="/dashboard" className="text-primary mx-1 hover:underline">
                  dashboard
                </Link>. 
                This includes real-time statistics on:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Current usage against your monthly limit</li>
                <li>Usage breakdown by operation type</li>
                <li>Historical usage patterns</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sdk" className="py-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">SDKs & Client Libraries</h2>
            <p>
              To make integration easier, ScanPro provides official client libraries 
              for various programming languages. These SDKs handle authentication, 
              error handling, and provide a more convenient interface to the API.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-medium mb-4">JavaScript/TypeScript</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Installation</h4>
                    <div className="bg-muted/20 p-4 rounded-md">
                      <pre><code>npm install scanpro-api-client</code></pre>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Usage Example</h4>
                    <div className="bg-muted/20 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
<code>{`import { ScanProClient } from 'scanpro-api-client';

const client = new ScanProClient('YOUR_API_KEY');

async function convertPdfToDocx() {
  try {
    const response = await client.convert({
      file: fs.readFileSync('document.pdf'),
      outputFormat: 'docx'
    });
    
    console.log('Conversion successful:', response.fileUrl);
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-medium mb-4">Python</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Installation</h4>
                    <div className="bg-muted/20 p-4 rounded-md">
                      <pre><code>pip install scanpro-api</code></pre>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Usage Example</h4>
                    <div className="bg-muted/20 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
<code>{`from scanpro import ScanProClient

client = ScanProClient('YOUR_API_KEY')

def compress_pdf():
    try:
        with open('document.pdf', 'rb') as file:
            response = client.compress(
                file=file,
                quality='medium'
            )
        
        print(f"Compression successful: {response.compression_ratio} saved")
        print(f"Download URL: {response.file_url}")
    except Exception as e:
        print(f"Compression failed: {e}")
`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-medium mb-4">PHP</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Installation</h4>
                    <div className="bg-muted/20 p-4 rounded-md">
                      <pre><code>composer require scanpro/api-client</code></pre>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Usage Example</h4>
                    <div className="bg-muted/20 p-4 rounded-md">
                      <pre className="text-sm overflow-x-auto">
<code>{`<?php
require 'vendor/autoload.php';

use ScanPro\ApiClient;

$client = new ApiClient('YOUR_API_KEY');

try {
    $response = $client->merge([
        'files' => [
            fopen('document1.pdf', 'r'),
            fopen('document2.pdf', 'r')
        ]
    ]);
    
    echo "Merge successful: " . $response->fileUrl;
} catch (Exception $e) {
    echo "Merge failed: " . $e->getMessage();
}
`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            
            <div className="mt-6">
              <p>
                For detailed documentation on each SDK, including all available methods and options,
                please visit the specific SDK documentation:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><a href="/developer/sdk/javascript" className="text-primary hover:underline">JavaScript/TypeScript SDK Documentation</a></li>
                <li><a href="/developer/sdk/python" className="text-primary hover:underline">Python SDK Documentation</a></li>
                <li><a href="/developer/sdk/php" className="text-primary hover:underline">PHP SDK Documentation</a></li>
                <li><a href="/developer/sdk/java" className="text-primary hover:underline">Java SDK Documentation</a></li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}