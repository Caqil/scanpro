// app/[lang]/api-docs/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, FileText, ArrowRight, FileImage, Lock } from 'lucide-react';

export default function ApiDocsPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('getting-started');

  const codeBlock = (code: string, language: string = 'bash') => (
    <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );

  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="mt-2 text-muted-foreground">
          Learn how to integrate ScanPro's powerful PDF and image processing capabilities into your applications
        </p>
      </div>

      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 space-y-4">
          <div className="rounded-md border">
            <div className="bg-muted px-4 py-2 font-medium">Navigation</div>
            <nav className="p-2">
              <ul className="space-y-1">
                {[
                  'getting-started',
                  'authentication',
                  'pdf-endpoints',
                  'image-endpoints',
                  'errors',
                  'rate-limits'
                ].map((tab) => (
                  <li key={tab}>
                    <Button 
                      variant={activeTab === tab ? 'secondary' : 'ghost'} 
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Button>
                  </li>
                ))}
                <li>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm mt-4"
                    onClick={() => router.push('/dashboard/api-keys')}
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    Manage API Keys
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'getting-started' && (
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with ScanPro API</CardTitle>
                <CardDescription>
                  Everything you need to start using the ScanPro API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The ScanPro API allows you to integrate our powerful PDF and image processing 
                  capabilities directly into your applications. This guide will help you get 
                  started with the basics.
                </p>

                <h3 className="text-lg font-medium mt-4">Base URL</h3>
                <p className="text-sm text-muted-foreground">
                  All API requests should be made to the following base URL:
                </p>
                {codeBlock('https://api.scanpro.cc/v1')}

                <h3 className="text-lg font-medium mt-4">Quick Start</h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li className="text-sm">
                    <span className="font-medium">Create an API key</span> - Go to your dashboard and create an API key
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Authenticate requests</span> - Add your API key in the <code>x-api-key</code> header
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Make API calls</span> - Use the endpoints documented below to access ScanPro features
                  </li>
                </ol>

                <div className="bg-muted p-4 rounded-md mt-6">
                  <h4 className="font-medium">Example: Convert a PDF to PNG</h4>
                  {codeBlock(`curl -X POST \\
  https://api.scanpro.cc/v1/pdf/convert/to-png \\
  -H "x-api-key: scp_abcdef123456_YOUR_SECRET_KEY" \\
  -F "file=@document.pdf" \\
  -F "quality=high"`)}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'authentication' && (
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  How to authenticate your API requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  All API requests must include your API key in the <code>x-api-key</code> header. 
                  API keys are used to authenticate requests and track usage.
                </p>

                <h3 className="text-lg font-medium mt-4">API Keys</h3>
                <p className="text-sm text-muted-foreground">
                  You can create and manage your API keys in the{' '}
                  <a href="/dashboard/api-keys" className="text-primary hover:underline">
                    API Keys Dashboard
                  </a>.
                </p>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md flex items-start gap-3 my-4">
                  <Lock className="text-amber-600 dark:text-amber-400 h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-600 dark:text-amber-400">
                      Security Note
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Your API key grants access to your account. Never share your API keys publicly 
                      or include them in client-side code. Always store your API keys securely.
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-4">Example Request with Authentication</h3>
                {codeBlock(`curl -X POST \\
  https://api.scanpro.cc/v1/pdf/convert/to-png \\
  -H "x-api-key: scp_abcdef123456_YOUR_SECRET_KEY" \\
  -F "file=@document.pdf" \\
  -F "quality=high"`)}
              </CardContent>
            </Card>
          )}

          {activeTab === 'pdf-endpoints' && (
            <Card>
              <CardHeader>
                <CardTitle>PDF Endpoints</CardTitle>
                <CardDescription>
                  Available endpoints for PDF processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  ScanPro provides a comprehensive set of endpoints for PDF processing, 
                  including conversion, compression, merging, splitting, and more.
                </p>

                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="pdf-convert">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>PDF Conversion</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Convert PDFs to and from other formats.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">PDF to Word</h4>
                        <p className="text-sm text-muted-foreground">
                          Convert PDF files to editable Word documents.
                        </p>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /pdf/convert/to-docx</code>
                        </div>
                        <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                          <li><code>file</code> (required) - The PDF file to convert</li>
                          <li><code>ocr</code> (optional) - Enable OCR for scanned documents (default: false)</li>
                          <li><code>pages</code> (optional) - Specific pages to convert (e.g. "1,3,5-10")</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">PDF to Excel</h4>
                        <p className="text-sm text-muted-foreground">
                          Convert PDF files to Excel spreadsheets.
                        </p>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /pdf/convert/to-xlsx</code>
                        </div>
                        <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                          <li><code>file</code> (required) - The PDF file to convert</li>
                          <li><code>ocr</code> (optional) - Enable OCR for scanned documents (default: false)</li>
                          <li><code>pages</code> (optional) - Specific pages to convert (e.g. "1,3,5-10")</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">PDF to Image</h4>
                        <p className="text-sm text-muted-foreground">
                          Convert PDF files to image formats (JPG or PNG).
                        </p>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /pdf/convert/to-jpg</code> or <code>POST /pdf/convert/to-png</code>
                        </div>
                        <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                          <li><code>file</code> (required) - The PDF file to convert</li>
                          <li><code>quality</code> (optional) - Image quality (low, medium, high) (default: medium)</li>
                          <li><code>dpi</code> (optional) - Resolution in DPI (default: 150)</li>
                          <li><code>pages</code> (optional) - Specific pages to convert (e.g. "1,3,5-10")</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="pdf-compress">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        <span>PDF Compression</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Compress PDF files to reduce file size while maintaining quality.
                      </p>
                      
                      <div className="bg-muted rounded-md p-2 text-sm">
                        <code>POST /pdf/compress</code>
                      </div>
                      
                      <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li><code>file</code> (required) - The PDF file to compress</li>
                        <li><code>quality</code> (optional) - Compression quality (low, medium, high) (default: medium)</li>
                        <li><code>images_only</code> (optional) - Only compress images in the PDF (default: false)</li>
                      </ul>
                      
                      <h5 className="text-sm font-medium mt-4">Example Request:</h5>
                      {codeBlock(`curl -X POST \\
  https://api.scanpro.cc/v1/pdf/compress \\
  -H "x-api-key: YOUR_API_KEY" \\
  -F "file=@document.pdf" \\
  -F "quality=medium"`, 'bash')}
                      
                      <h5 className="text-sm font-medium mt-4">Example Response:</h5>
                      {codeBlock(`{
  "success": true,
  "message": "PDF compressed successfully",
  "originalSize": 1045678,
  "compressedSize": 524288,
  "compressionRatio": "49.9%",
  "downloadUrl": "https://api.scanpro.cc/v1/download/abc123def456"
}`, 'json')}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="pdf-merge">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        <span>PDF Merge</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Merge multiple PDF files into a single PDF document.
                      </p>
                      
                      <div className="bg-muted rounded-md p-2 text-sm mt-2">
                        <code>POST /pdf/merge</code>
                      </div>
                      
                      <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li><code>files[]</code> (required) - Array of PDF files to merge</li>
                        <li><code>bookmark</code> (optional) - Add bookmarks for each file (default: true)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="pdf-split">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        <span>PDF Split</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Split a PDF file into multiple separate PDF files.
                      </p>
                      
                      <div className="bg-muted rounded-md p-2 text-sm mt-2">
                        <code>POST /pdf/split</code>
                      </div>
                      
                      <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li><code>file</code> (required) - The PDF file to split</li>
                        <li><code>method</code> (required) - Split method (pages, range, every)</li>
                        <li><code>ranges</code> (required for method=range) - Page ranges (e.g. "1-3,4-6")</li>
                        <li><code>every</code> (required for method=every) - Split every N pages</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="pdf-protect">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>PDF Protection</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Add password protection to PDF files.
                      </p>
                      
                      <div className="bg-muted rounded-md p-2 text-sm mt-2">
                        <code>POST /pdf/protect</code>
                      </div>
                      
                      <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li><code>file</code> (required) - The PDF file to protect</li>
                        <li><code>password</code> (required) - Password to secure the PDF</li>
                        <li><code>permission</code> (optional) - Permission level (all, restricted) (default: restricted)</li>
                        <li><code>allowPrinting</code> (optional) - Allow printing (default: true)</li>
                        <li><code>allowCopying</code> (optional) - Allow copying text (default: false)</li>
                        <li><code>allowEditing</code> (optional) - Allow editing (default: false)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="pdf-unlock">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>PDF Unlock</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Remove password protection from PDF files.
                      </p>
                      
                      <div className="bg-muted rounded-md p-2 text-sm mt-2">
                        <code>POST /pdf/unlock</code>
                      </div>
                      
                      <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li><code>file</code> (required) - The PDF file to unlock</li>
                        <li><code>password</code> (required) - Current password of the PDF</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}

          {activeTab === 'image-endpoints' && (
            <Card>
              <CardHeader>
                <CardTitle>Image Endpoints</CardTitle>
                <CardDescription>
                  Available endpoints for image processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  ScanPro provides powerful image processing endpoints for converting, compressing, 
                  and manipulating images.
                </p>

                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="image-convert">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <FileImage className="h-4 w-4 mr-2" />
                        <span>Image Conversion</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Convert images between different formats.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">PNG to JPG</h4>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /image/png-to-jpg</code>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">JPG to PNG</h4>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /image/jpg-to-png</code>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">PNG to WebP</h4>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /image/png-to-webp</code>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">WebP to PNG</h4>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /image/webp-to-png</code>
                        </div>
                      </div>
                      
                      <h5 className="text-sm font-medium mt-4">Common Parameters:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li><code>file</code> (required) - The image file to convert</li>
                        <li><code>quality</code> (optional) - Output quality (1-100) (default depends on format)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="image-compress">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <FileImage className="h-4 w-4 mr-2" />
                        <span>Image Compression</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        Compress images to reduce file size while maintaining quality.
                      </p>
                      
                      <div className="bg-muted rounded-md p-2 text-sm mt-2">
                        <code>POST /image/compress-png</code>
                      </div>
                      
                      <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li><code>file</code> (required) - The image file to compress</li>
                        <li><code>quality</code> (optional) - Compression quality (1-100) (default: 80)</li>
                        <li><code>lossless</code> (optional) - Use lossless compression (default: false)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="image-edit">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <FileImage className="h-4 w-4 mr-2" />
                        <span>Image Editing</span>
                        <Badge className="ml-2" variant="outline">POST</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Edit and manipulate images.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Resize Image</h4>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /image/resize</code>
                        </div>
                        <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                          <li><code>file</code> (required) - The image file to resize</li>
                          <li><code>width</code> (required) - Target width in pixels</li>
                          <li><code>height</code> (required) - Target height in pixels</li>
                          <li><code>method</code> (optional) - Resize method (fit, fill, cover) (default: fit)</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">Make Transparent</h4>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /image/make-transparent</code>
                        </div>
                        <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                          <li><code>file</code> (required) - The image file to process</li>
                          <li><code>color</code> (required) - Color to make transparent (hex format)</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">Change Colors</h4>
                        <div className="bg-muted rounded-md p-2 text-sm">
                          <code>POST /image/change-colors</code>
                        </div>
                        <h5 className="text-sm font-medium mt-2">Parameters:</h5>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                          <li><code>file</code> (required) - The image file to process</li>
                          <li><code>colorMappings</code> (required) - JSON array of color mappings</li>
                          <li><code>tolerance</code> (optional) - Color matching tolerance (default: 30)</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}

          {activeTab === 'errors' && (
            <Card>
              <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>
                  Understanding and handling API errors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The ScanPro API uses standard HTTP status codes to indicate the success or failure 
                  of requests. In addition, error responses include a JSON body with details about 
                  the error.
                </p>

                <h3 className="text-lg font-medium mt-4">HTTP Status Codes</h3>
                <div className="rounded-md border overflow-hidden mt-2">
                  <table className="min-w-full divide-y">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">Status Code</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-2 text-sm">200 - OK</td>
                        <td className="px-4 py-2 text-sm">The request was successful</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">400 - Bad Request</td>
                        <td className="px-4 py-2 text-sm">The request was invalid or missing required parameters</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">401 - Unauthorized</td>
                        <td className="px-4 py-2 text-sm">API key is missing or invalid</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">403 - Forbidden</td>
                        <td className="px-4 py-2 text-sm">The API key doesn't have permission for this operation</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">404 - Not Found</td>
                        <td className="px-4 py-2 text-sm">The requested resource was not found</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">429 - Too Many Requests</td>
                        <td className="px-4 py-2 text-sm">Rate limit exceeded</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm">500 - Internal Server Error</td>
                        <td className="px-4 py-2 text-sm">Something went wrong on our end</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-medium mt-6">Error Response Format</h3>
                <p className="text-sm text-muted-foreground">
                  Error responses include a JSON body with the following structure:
                </p>
                {codeBlock(`{
  "error": "Error type",
  "message": "Detailed error message",
  "code": "Error code (optional)",
  "details": {} // Additional details (optional)
}`, 'json')}

                <h3 className="text-lg font-medium mt-6">Example Error Handling</h3>
                {codeBlock(`try {
  const response = await fetch('https://api.scanpro.cc/v1/pdf/compress', {
    method: 'POST',
    headers: {
      'x-api-key': 'YOUR_API_KEY'
    },
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(\`\${errorData.error}: \${errorData.message}\`);
  }
  
  const data = await response.json();
  // Process successful response
} catch (error) {
  console.error('API request failed:', error);
  // Handle error
}`, 'javascript')}
              </CardContent>
            </Card>
          )}

          {activeTab === 'rate-limits' && (
            <Card>
              <CardHeader>
                <CardTitle>Rate Limits</CardTitle>
                <CardDescription>
                  Understanding API rate limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To ensure the stability and availability of the API for all users, 
                  ScanPro implements rate limiting on API requests.
                </p>

                <h3 className="text-lg font-medium mt-4">Default Rate Limits</h3>
                <p className="text-sm text-muted-foreground">
                  The default rate limit is 60 requests per minute per API key.
                </p>

                <h3 className="text-lg font-medium mt-6">Rate Limit Headers</h3>
                <p className="text-sm text-muted-foreground">
                  Rate limit information is included in the response headers:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2 mt-2">
                  <li><code>X-RateLimit-Limit</code> - Maximum number of requests allowed per minute</li>
                  <li><code>X-RateLimit-Remaining</code> - Number of requests remaining in the current window</li>
                  <li><code>X-RateLimit-Reset</code> - Time in seconds until the rate limit resets</li>
                </ul>

                <h3 className="text-lg font-medium mt-6">Rate Limit Exceeded</h3>
                <p className="text-sm text-muted-foreground">
                  When rate limits are exceeded, the API returns a 429 Too Many Requests response:
                </p>
                {codeBlock(`{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Maximum 60 requests per minute."
}`, 'json')}

                <h3 className="text-lg font-medium mt-6">Best Practices</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Implement exponential backoff for retries when rate limited</li>
                  <li>Cache responses when possible to reduce API calls</li>
                  <li>Monitor your API usage in the dashboard</li>
                  <li>Contact us if you need higher rate limits for your application</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}