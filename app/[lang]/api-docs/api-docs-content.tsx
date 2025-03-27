// components/api-documentation-content/api-documentation-content.tsx
"use client";

import React from "react";
import { useLanguageStore } from "@/src/store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  KeyRound, 
  AlertTriangle, 
  Code, 
  FileText,
  Image, 
} from "lucide-react";

export function ApiDocumentationContent() {
  const { t } = useLanguageStore();
  
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://scanpro.cc/api";

  return (
    <div className="container max-w-5xl py-12 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ScanPro API Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Integrate powerful PDF and image processing capabilities into your applications
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="pdf-api">PDF API</TabsTrigger>
          <TabsTrigger value="image-api">Image API</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the ScanPro API</CardTitle>
              <CardDescription>
                Everything you need to integrate document processing into your applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ScanPro's API allows you to integrate our powerful document and image processing capabilities 
                directly into your applications. With our API, you can:
              </p>
              
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Convert files between various formats (PDF, Word, Excel, PowerPoint, images)</li>
                <li>Compress files to reduce size while maintaining quality</li>
                <li>Merge, split, and organize PDF documents</li>
                <li>Add watermarks, signatures, and password protection</li>
                <li>Extract text from documents with OCR (Optical Character Recognition)</li>
                <li>And much more!</li>
              </ul>
              
              <div className="bg-muted p-4 rounded-md mt-6">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Important Update
                </h3>
                <p className="text-sm">
                  All API endpoints now require API key authentication. Please make sure to include your API key 
                  in the <code className="bg-background px-1 py-0.5 rounded text-xs">x-api-key</code> header with all requests.
                </p>
              </div>
              
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium">Base URL</h3>
                <p>All API URLs referenced in this documentation have the following base:</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  {baseApiUrl}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>
                Get up and running with the ScanPro API in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-4 pl-4">
                <li>
                  <strong>Create an API Key</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Go to your Dashboard &gt; API Keys and create a new API key. Make sure to save this key securely.
                  </p>
                </li>
                <li>
                  <strong>Include Authentication</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your API key to the <code className="bg-muted px-1 py-0.5 rounded text-xs">x-api-key</code> header in all your requests.
                  </p>
                </li>
                <li>
                  <strong>Make Your First Request</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try a simple endpoint, like converting a PDF to DOCX, to test your integration.
                  </p>
                </li>
              </ol>
              
              <div className="bg-muted p-4 rounded-md mt-6">
                <h3 className="text-lg font-medium mb-2">Sample Request (cURL)</h3>
                <pre className="bg-background p-3 rounded-md overflow-x-auto text-xs">
                  {`curl -X POST ${baseApiUrl}/convert/pdf-to-docx \\
  -H "x-api-key: your_api_key_here" \\
  -F "file=@sample.pdf"`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <KeyRound className="h-5 w-5 mr-2" />
                API Key Authentication
              </CardTitle>
              <CardDescription>
                How to authenticate your requests to the ScanPro API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All requests to the ScanPro API must be authenticated using an API key. This key 
                must be included in the <code className="bg-muted px-1 py-0.5 rounded text-xs">x-api-key</code> header 
                of each request.
              </p>
              
              <h3 className="text-lg font-medium mt-6">Creating an API Key</h3>
              <p>
                To create an API key, navigate to your ScanPro Dashboard and select the "API Keys" 
                section. Click the "Create API Key" button, give your key a name, and save it securely.
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md mt-4 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 dark:text-amber-400 h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-600 dark:text-amber-400">
                    Security Warning
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your API key provides access to your account and is displayed only once when created.
                    Store it securely and never share it publicly or include it in client-side code.
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-6">Including Your API Key</h3>
              <p>
                Include your API key in the <code className="bg-muted px-1 py-0.5 rounded text-xs">x-api-key</code> header 
                with each request:
              </p>
              
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="text-md font-medium mb-2">Examples</h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">cURL</h5>
                    <pre className="bg-background p-3 rounded-md overflow-x-auto text-xs">
                      {`curl -X POST ${baseApiUrl}/compress \\
  -H "x-api-key: your_api_key_here" \\
  -F "file=@sample.pdf"`}
                    </pre>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">JavaScript (fetch)</h5>
                    <pre className="bg-background p-3 rounded-md overflow-x-auto text-xs">
{`const formData = new FormData();
formData.append("file", fileObject);

fetch("${baseApiUrl}/compress", {
  method: "POST",
  headers: {
    "x-api-key": "your_api_key_here"
  },
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}
                    </pre>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium">Python (requests)</h5>
                    <pre className="bg-background p-3 rounded-md overflow-x-auto text-xs">
{`import requests

url = "${baseApiUrl}/compress"
headers = {
    "x-api-key": "your_api_key_here"
}
files = {
    "file": open("sample.pdf", "rb")
}

response = requests.post(url, headers=headers, files=files)
print(response.json())`}
                    </pre>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-6">API Key Rate Limits</h3>
              <p>
                Each API key is subject to rate limiting. Basic API keys have a limit of 60 requests per minute.
                If you exceed this limit, you'll receive a <code className="bg-muted px-1 py-0.5 rounded text-xs">429 Too Many Requests</code> response.
                Contact us if you need higher rate limits for your application.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf-api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                PDF Processing API
              </CardTitle>
              <CardDescription>
                Endpoints for working with PDF files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">PDF Conversion</h3>
                <div className="border rounded-md divide-y">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-md mr-3">POST</span>
                        <code className="text-sm">/api/convert/pdf-to-docx</code>
                      </div>
                      <span className="text-xs text-muted-foreground">Convert PDF to Word</span>
                    </div>
                    <p className="text-sm mt-2">
                      Converts a PDF file to Microsoft Word format (.docx)
                    </p>
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Request Parameters</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-mono bg-muted px-2 py-1 rounded">file</div>
                        <div>File (multipart/form-data)</div>
                        <div className="text-muted-foreground">Required</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-md mr-3">POST</span>
                        <code className="text-sm">/api/convert/pdf-to-xlsx</code>
                      </div>
                      <span className="text-xs text-muted-foreground">Convert PDF to Excel</span>
                    </div>
                    <p className="text-sm mt-2">
                      Converts a PDF file to Microsoft Excel format (.xlsx)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">PDF Manipulation</h3>
                <div className="border rounded-md divide-y">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-md mr-3">POST</span>
                        <code className="text-sm">/api/compress</code>
                      </div>
                      <span className="text-xs text-muted-foreground">Compress PDF</span>
                    </div>
                    <p className="text-sm mt-2">
                      Reduces PDF file size while maintaining quality
                    </p>
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Request Parameters</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-mono bg-muted px-2 py-1 rounded">file</div>
                        <div>File (multipart/form-data)</div>
                        <div className="text-muted-foreground">Required</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="font-mono bg-muted px-2 py-1 rounded">quality</div>
                        <div>String: high, medium, low</div>
                        <div className="text-muted-foreground">Optional</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-md mr-3">POST</span>
                        <code className="text-sm">/api/merge</code>
                      </div>
                      <span className="text-xs text-muted-foreground">Merge PDFs</span>
                    </div>
                    <p className="text-sm mt-2">
                      Combines multiple PDF files into a single document
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image-api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Image Processing API
              </CardTitle>
              <CardDescription>
                Endpoints for working with image files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Image Conversion</h3>
                <div className="border rounded-md divide-y">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-md mr-3">POST</span>
                        <code className="text-sm">/api/convert/jpg-to-pdf</code>
                      </div>
                      <span className="text-xs text-muted-foreground">Convert JPG to PDF</span>
                    </div>
                    <p className="text-sm mt-2">
                      Converts JPG images to PDF format
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-md mr-3">POST</span>
                        <code className="text-sm">/api/convert/png-to-pdf</code>
                      </div>
                      <span className="text-xs text-muted-foreground">Convert PNG to PDF</span>
                    </div>
                    <p className="text-sm mt-2">
                      Converts PNG images to PDF format
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Image Manipulation</h3>
                <div className="border rounded-md divide-y">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-md mr-3">POST</span>
                        <code className="text-sm">/api/compress/image</code>
                      </div>
                      <span className="text-xs text-muted-foreground">Compress Image</span>
                    </div>
                    <p className="text-sm mt-2">
                      Reduces image file size while maintaining quality
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Code Examples
              </CardTitle>
              <CardDescription>
                Sample code for common API use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Convert PDF to Word (Node.js)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function convertPdfToWord(apiKey, pdfPath) {
  // Create form data for file upload
  const form = new FormData();
  form.append('file', fs.createReadStream(pdfPath));
  
  try {
    // Make API request
    const response = await fetch('${baseApiUrl}/convert/pdf-to-docx', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey
      },
      body: form
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(\`API error: \${errorData.error || response.statusText}\`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Download the converted file
    const docxResponse = await fetch(data.fileUrl);
    const filename = path.basename(pdfPath, '.pdf') + '.docx';
    const fileStream = fs.createWriteStream(filename);
    
    await new Promise((resolve, reject) => {
      docxResponse.body.pipe(fileStream);
      docxResponse.body.on('error', reject);
      fileStream.on('finish', resolve);
    });
    
    console.log(\`Successfully converted PDF to Word: \${filename}\`);
    return filename;
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
}

// Usage
convertPdfToWord('your_api_key_here', 'path/to/document.pdf')
  .then(filename => console.log(\`File saved as: \${filename}\`))
  .catch(error => console.error(error));`}
                </pre>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Compress PDF (Python)</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`import requests
import os

def compress_pdf(api_key, pdf_path, quality='medium'):
    """
    Compress a PDF file using the ScanPro API
    
    Args:
        api_key (str): Your ScanPro API key
        pdf_path (str): Path to the PDF file to compress
        quality (str): Compression quality (high, medium, low)
        
    Returns:
        str: Path to the compressed PDF file
    """
    url = "${baseApiUrl}/compress"
    
    headers = {
        "x-api-key": api_key
    }
    
    files = {
        "file": open(pdf_path, "rb")
    }
    
    data = {
        "quality": quality
    }
    
    try:
        # Make API request
        response = requests.post(url, headers=headers, files=files, data=data)
        response.raise_for_status()
        
        # Parse response
        result = response.json()
        
        # Download the compressed file
        compressed_response = requests.get(result["fileUrl"])
        compressed_response.raise_for_status()
        
        # Save the file
        filename = os.path.basename(pdf_path)
        output_path = f"compressed_{filename}"
        
        with open(output_path, "wb") as f:
            f.write(compressed_response.content)
            
        print(f"Successfully compressed PDF. Original: {result['originalSize']} bytes, Compressed: {result['compressedSize']} bytes")
        return output_path
    
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        raise
    finally:
        # Close the file
        files["file"].close()

# Usage
api_key = "your_api_key_here"
pdf_path = "path/to/document.pdf"
compress_pdf(api_key, pdf_path, quality="medium")`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}