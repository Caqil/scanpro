import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata = {
  title: "API Documentation | PDF Converter Pro",
  description: "Documentation for the PDF Converter Pro REST API",
};

export default function ApiDocsPage() {
  return (
    <div className="container max-w-5xl py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex flex-col items-center text-center mb-12 md:mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          API Documentation
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[800px]">
          Integrate PDF conversion capabilities directly into your applications
        </p>
      </div>

      <Alert className="mb-8">
        <AlertTitle>API Beta Access</AlertTitle>
        <AlertDescription>
          Our API is currently in beta. Contact us for access keys and increased rate limits.
        </AlertDescription>
      </Alert>

      <div className="space-y-12">
        {/* Authentication Section */}
        <section id="authentication" className="space-y-4">
          <h2 className="text-2xl font-bold">Authentication</h2>
          <p>
            All API requests require an API key to be included in the request headers. 
            You can obtain an API key by registering for an account.
          </p>
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm">
              <code>
                {`X-API-Key: your_api_key_here`}
              </code>
            </pre>
          </div>
        </section>

        {/* Endpoints Section */}
        <section id="endpoints" className="space-y-8">
          <h2 className="text-2xl font-bold">Endpoints</h2>

          {/* Convert Endpoint */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">POST</span>
              <h3 className="text-xl font-semibold">/api/convert</h3>
            </div>
            <p>Convert a PDF file to another format.</p>

            <Tabs defaultValue="request">
              <TabsList>
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>
              <TabsContent value="request" className="space-y-4 mt-4">
                <p>This endpoint accepts <code>multipart/form-data</code> with the following fields:</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left font-medium">Field</th>
                        <th className="p-2 text-left font-medium">Type</th>
                        <th className="p-2 text-left font-medium">Required</th>
                        <th className="p-2 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2 font-mono text-sm">pdf</td>
                        <td className="p-2">File</td>
                        <td className="p-2">Yes</td>
                        <td className="p-2">The PDF file to convert</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-sm">format</td>
                        <td className="p-2">String</td>
                        <td className="p-2">Yes</td>
                        <td className="p-2">
                          Target format: docx, doc, xlsx, pptx, txt, html, jpg, png, csv, rtf, odt
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-sm">ocr</td>
                        <td className="p-2">Boolean</td>
                        <td className="p-2">No</td>
                        <td className="p-2">Enable OCR text extraction (true/false, default: false)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-sm">quality</td>
                        <td className="p-2">Number</td>
                        <td className="p-2">No</td>
                        <td className="p-2">Output quality for image formats (10-100, default: 90)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-sm">password</td>
                        <td className="p-2">String</td>
                        <td className="p-2">No</td>
                        <td className="p-2">Password for protected PDF files</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="response" className="space-y-4 mt-4">
                <p>Successful response (200 OK):</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`{
  "success": true,
  "message": "Conversion successful",
  "fileUrl": "/conversions/12345-abcde-67890.docx",
  "filename": "12345-abcde-67890.docx",
  "originalName": "document.pdf",
  "format": "docx"
}`}
                    </code>
                  </pre>
                </div>
                <p>The converted file can be downloaded using the <code>fileUrl</code> path.</p>
              </TabsContent>
              
              <TabsContent value="errors" className="space-y-4 mt-4">
                <p>Possible error responses:</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left font-medium">Status Code</th>
                        <th className="p-2 text-left font-medium">Error</th>
                        <th className="p-2 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2">400</td>
                        <td className="p-2">No PDF file provided</td>
                        <td className="p-2">The request is missing the PDF file</td>
                      </tr>
                      <tr>
                        <td className="p-2">400</td>
                        <td className="p-2">Invalid format</td>
                        <td className="p-2">The specified format is not supported</td>
                      </tr>
                      <tr>
                        <td className="p-2">401</td>
                        <td className="p-2">Unauthorized</td>
                        <td className="p-2">Invalid or missing API key</td>
                      </tr>
                      <tr>
                        <td className="p-2">413</td>
                        <td className="p-2">File too large</td>
                        <td className="p-2">The PDF file exceeds the maximum size limit</td>
                      </tr>
                      <tr>
                        <td className="p-2">500</td>
                        <td className="p-2">Conversion error</td>
                        <td className="p-2">Failed to convert the PDF file</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="example" className="space-y-4 mt-4">
                <p>Example using cURL:</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`curl -X POST \\
  -H "X-API-Key: your_api_key_here" \\
  -F "pdf=@/path/to/document.pdf" \\
  -F "format=docx" \\
  -F "ocr=false" \\
  https://pdfconverter.pro/api/convert`}
                    </code>
                  </pre>
                </div>
                
                <p>Example using JavaScript (with Fetch API):</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`const form = new FormData();
form.append('pdf', pdfFile); // A File object
form.append('format', 'docx');
form.append('ocr', 'false');

const response = await fetch('https://pdfconverter.pro/api/convert', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
  },
  body: form
});

const data = await response.json();
console.log(data);`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Download Endpoint */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded">GET</span>
              <h3 className="text-xl font-semibold">/api/download/:filename</h3>
            </div>
            <p>Download a previously converted file.</p>

            <Tabs defaultValue="request">
              <TabsList>
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>
              <TabsContent value="request" className="space-y-4 mt-4">
                <p>Path parameters:</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left font-medium">Parameter</th>
                        <th className="p-2 text-left font-medium">Type</th>
                        <th className="p-2 text-left font-medium">Required</th>
                        <th className="p-2 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 font-mono text-sm">filename</td>
                        <td className="p-2">String</td>
                        <td className="p-2">Yes</td>
                        <td className="p-2">The filename returned from the conversion endpoint</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="response" className="space-y-4 mt-4">
                <p>On success, returns the file with appropriate headers:</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left font-medium">Header</th>
                        <th className="p-2 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2 font-mono text-sm">Content-Type</td>
                        <td className="p-2">The MIME type of the file (depends on the format)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-sm">Content-Disposition</td>
                        <td className="p-2">attachment; filename=&#34;filename.ext&#34;</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-sm">Content-Length</td>
                        <td className="p-2">The size of the file in bytes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="errors" className="space-y-4 mt-4">
                <p>Possible error responses:</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left font-medium">Status Code</th>
                        <th className="p-2 text-left font-medium">Error</th>
                        <th className="p-2 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2">400</td>
                        <td className="p-2">Invalid filename</td>
                        <td className="p-2">The filename parameter is invalid</td>
                      </tr>
                      <tr>
                        <td className="p-2">404</td>
                        <td className="p-2">File not found</td>
                        <td className="p-2">The requested file was not found</td>
                      </tr>
                      <tr>
                        <td className="p-2">500</td>
                        <td className="p-2">Server error</td>
                        <td className="p-2">Failed to download the file</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="example" className="space-y-4 mt-4">
                <p>Example using cURL:</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`curl -X GET \\
  -H "X-API-Key: your_api_key_here" \\
  -O https://pdfconverter.pro/api/download/12345-abcde-67890.docx`}
                    </code>
                  </pre>
                </div>
                
                <p>Example using JavaScript (with Fetch API):</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`const response = await fetch('https://pdfconverter.pro/api/download/12345-abcde-67890.docx', {
  method: 'GET',
  headers: {
    'X-API-Key': 'your_api_key_here',
  }
});

if (response.ok) {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '12345-abcde-67890.docx';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Status Endpoint */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded">GET</span>
              <h3 className="text-xl font-semibold">/api/status</h3>
            </div>
            <p>Check the API status and service health.</p>

            <Tabs defaultValue="response">
              <TabsList>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>
              
              <TabsContent value="response" className="space-y-4 mt-4">
                <p>Successful response (200 OK):</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`{
  "uptime": 86400,
  "timestamp": 1647345678901,
  "nodejs": "v18.17.0",
  "os": {
    "platform": "linux",
    "release": "5.4.0-1018-aws",
    "type": "Linux",
    "arch": "x64",
    "cpus": 4,
    "totalMemory": 8589934592,
    "freeMemory": 4294967296,
    "loadAverage": [0.5, 0.3, 0.2]
  },
  "storage": {
    "uploadDirExists": true,
    "conversionDirExists": true,
    "uploadCount": 12,
    "conversionCount": 10
  },
  "dependencies": {
    "libreOfficeInstalled": true,
    "libreOfficeVersion": "LibreOffice 7.3.5.2"
  },
  "status": "healthy"
}`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="example" className="space-y-4 mt-4">
                <p>Example using cURL:</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`curl -X GET \\
  -H "X-API-Key: your_api_key_here" \\
  https://pdfconverter.pro/api/status`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Admin Cleanup Endpoint */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-semibold bg-amber-600 text-white rounded">GET</span>
              <h3 className="text-xl font-semibold">/api/admin/cleanup</h3>
            </div>
            <p>Clean up temporary files (admin access only).</p>

            <Tabs defaultValue="request">
              <TabsList>
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="example">Example</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="space-y-4 mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left font-medium">Parameter</th>
                        <th className="p-2 text-left font-medium">Type</th>
                        <th className="p-2 text-left font-medium">Required</th>
                        <th className="p-2 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 font-mono text-sm">maxAge</td>
                        <td className="p-2">Number</td>
                        <td className="p-2">No</td>
                        <td className="p-2">Maximum age of files to keep (in minutes, default: 60)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>Headers:</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left font-medium">Header</th>
                        <th className="p-2 text-left font-medium">Required</th>
                        <th className="p-2 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 font-mono text-sm">X-API-Key</td>
                        <td className="p-2">Yes</td>
                        <td className="p-2">Admin API key (must have admin privileges)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="response" className="space-y-4 mt-4">
                <p>Successful response (200 OK):</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`{
  "success": true,
  "message": "Cleanup completed. Removed files older than 60 minutes."
}`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="example" className="space-y-4 mt-4">
                <p>Example using cURL:</p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm">
                    <code>
{`curl -X GET \\
  -H "X-API-Key: your_admin_api_key_here" \\
  "https://pdfconverter.pro/api/admin/cleanup?maxAge=120"`}
                    </code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Rate Limits Section */}
        <section id="rate-limits" className="space-y-4">
          <h2 className="text-2xl font-bold">Rate Limits</h2>
          <p>
            API usage is subject to rate limiting to ensure fair usage. Rate limits vary by account type.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left font-medium">Plan</th>
                  <th className="p-2 text-left font-medium">Rate Limit</th>
                  <th className="p-2 text-left font-medium">File Size Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-2">Free</td>
                  <td className="p-2">50 requests per day</td>
                  <td className="p-2">10 MB</td>
                </tr>
                <tr>
                  <td className="p-2">Basic</td>
                  <td className="p-2">500 requests per day</td>
                  <td className="p-2">25 MB</td>
                </tr>
                <tr>
                  <td className="p-2">Premium</td>
                  <td className="p-2">5,000 requests per day</td>
                  <td className="p-2">50 MB</td>
                </tr>
                <tr>
                  <td className="p-2">Enterprise</td>
                  <td className="p-2">Custom</td>
                  <td className="p-2">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            When you exceed your rate limit, the API will return a 429 Too Many Requests response.
          </p>
        </section>

        {/* SDK Libraries Section */}
        <section id="sdk-libraries" className="space-y-4">
          <h2 className="text-2xl font-bold">SDK Libraries</h2>
          <p>
            We provide official SDK libraries to simplify API integration in various programming languages.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a href="#" className="flex items-center p-4 border rounded-lg hover:border-primary">
              <div className="mr-3 text-2xl">📦</div>
              <div>
                <h3 className="font-medium">JavaScript/TypeScript</h3>
                <p className="text-sm text-muted-foreground">npm install pdf-converter-pro</p>
              </div>
            </a>
            <a href="#" className="flex items-center p-4 border rounded-lg hover:border-primary">
              <div className="mr-3 text-2xl">🐍</div>
              <div>
                <h3 className="font-medium">Python</h3>
                <p className="text-sm text-muted-foreground">pip install pdf-converter-pro</p>
              </div>
            </a>
            <a href="#" className="flex items-center p-4 border rounded-lg hover:border-primary">
              <div className="mr-3 text-2xl">☕</div>
              <div>
                <h3 className="font-medium">Java</h3>
                <p className="text-sm text-muted-foreground">Maven/Gradle dependency</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}