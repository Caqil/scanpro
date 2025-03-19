
"use client"

import React, { useState } from 'react';

type NodeKey = 'main' | 'conversion' | 'tools' | 'security' | 'company' | 'support';

const Sitemap = () => {
  const [expandedNodes, setExpandedNodes] = useState({
    main: true,
    conversion: true,
    tools: true,
    security: true,
    company: true,
    support: true
  });

  const toggleNode = (node: NodeKey) => {
    setExpandedNodes(prev => ({
      ...prev,
      [node]: !prev[node]
    }));
  };
  
  // Color scheme
  const colors = {
    main: '#3b82f6', // blue-500
    conversion: '#8b5cf6', // violet-500
    tools: '#ef4444', // red-500
    security: '#10b981', // emerald-500
    company: '#f59e0b', // amber-500
    support: '#6366f1', // indigo-500
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col space-y-8">
        {/* Title and Description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">ScanPro PDF Tools - Website Sitemap</h1>
          <p className="text-gray-500 dark:text-gray-400">
            A comprehensive overview of the website structure and page hierarchy
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
            <span>Main Pages</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-violet-500 mr-2"></div>
            <span>Conversion Tools</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
            <span>Core Tools</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-emerald-500 mr-2"></div>
            <span>Security Tools</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-amber-500 mr-2"></div>
            <span>Company Pages</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-indigo-500 mr-2"></div>
            <span>Support Pages</span>
          </div>
        </div>

        {/* Main sitemap structure */}
        <div className="sitemap-container overflow-auto">
          <ul className="sitemap">
            {/* Homepage */}
            <li>
              <div 
                className="sitemap-node sitemap-root"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: colors.main }}
              >
                <div className="flex items-center">
                  <span className="font-bold">Home</span>
                  <span className="text-sm text-gray-500 ml-2">/</span>
                </div>
                <div className="text-xs text-gray-500">Main landing page with featured tools</div>
              </div>
              
              <ul>
                {/* PDF Tools Hub */}
                <li>
                  <div 
                    className="sitemap-node cursor-pointer"
                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: colors.main }}
                    onClick={() => toggleNode('tools')}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">All PDF Tools</span>
                      <span className="text-sm text-gray-500 ml-2">/tools</span>
                      <span className="ml-2">{expandedNodes.tools ? '−' : '+'}</span>
                    </div>
                    <div className="text-xs text-gray-500">Directory of all PDF utilities</div>
                  </div>
                  
                  {expandedNodes.tools && (
                    <ul>
                      {/* Basic PDF Tools */}
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.tools }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Merge PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/merge</span>
                          </div>
                          <div className="text-xs text-gray-500">Combine multiple PDFs into one</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.tools }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Split PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/split</span>
                          </div>
                          <div className="text-xs text-gray-500">Extract pages from PDF</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.tools }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Compress PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/compress</span>
                          </div>
                          <div className="text-xs text-gray-500">Reduce PDF file size</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.tools }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Rotate PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/rotate</span>
                          </div>
                          <div className="text-xs text-gray-500">Change PDF page orientation</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.tools }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Watermark PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/watermark</span>
                          </div>
                          <div className="text-xs text-gray-500">Add text watermarks to PDF</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.tools }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Edit PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/edit</span>
                            <span className="text-xs bg-red-100 text-red-600 px-1 rounded ml-2">New</span>
                          </div>
                          <div className="text-xs text-gray-500">Edit PDF content</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: colors.tools }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">OCR</span>
                            <span className="text-sm text-gray-500 ml-2">/ocr</span>
                            <span className="text-xs bg-red-100 text-red-600 px-1 rounded ml-2">New</span>
                          </div>
                          <div className="text-xs text-gray-500">Extract text from scanned PDFs</div>
                        </div>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Conversion Tools Hub */}
                <li>
                  <div 
                    className="sitemap-node cursor-pointer"
                    style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                    onClick={() => toggleNode('conversion')}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">Convert</span>
                      <span className="text-sm text-gray-500 ml-2">/convert</span>
                      <span className="ml-2">{expandedNodes.conversion ? '−' : '+'}</span>
                    </div>
                    <div className="text-xs text-gray-500">File format conversion hub</div>
                  </div>
                  
                  {expandedNodes.conversion && (
                    <ul>
                      {/* From PDF Conversions */}
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">PDF to Word</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/pdf-to-docx</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert PDF to editable Word</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">PDF to Excel</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/pdf-to-xlsx</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert PDF tables to Excel</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">PDF to PowerPoint</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/pdf-to-pptx</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert PDF to PowerPoint slides</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">PDF to Images</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/pdf-to-jpg</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert PDF to JPG/PNG images</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">PDF to HTML</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/pdf-to-html</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert PDF to HTML webpage</div>
                        </div>
                      </li>

                      {/* To PDF Conversions */}
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Word to PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/docx-to-pdf</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert Word docs to PDF</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Excel to PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/xlsx-to-pdf</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert Excel to PDF</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">PowerPoint to PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/pptx-to-pdf</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert PowerPoint to PDF</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Images to PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/jpg-to-pdf</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert JPG/PNG to PDF</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: colors.conversion }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">HTML to PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/convert/html-to-pdf</span>
                          </div>
                          <div className="text-xs text-gray-500">Convert webpages to PDF</div>
                        </div>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Security Section */}
                <li>
                  <div 
                    className="sitemap-node cursor-pointer"
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: colors.security }}
                    onClick={() => toggleNode('security')}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">Security Tools</span>
                      <span className="ml-2">{expandedNodes.security ? '−' : '+'}</span>
                    </div>
                    <div className="text-xs text-gray-500">PDF protection and security features</div>
                  </div>
                  
                  {expandedNodes.security && (
                    <ul>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: colors.security }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Protect PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/protect</span>
                          </div>
                          <div className="text-xs text-gray-500">Add password protection to PDF</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: colors.security }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Unlock PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/unlock</span>
                          </div>
                          <div className="text-xs text-gray-500">Remove PDF password protection</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: colors.security }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Sign PDF</span>
                            <span className="text-sm text-gray-500 ml-2">/sign</span>
                          </div>
                          <div className="text-xs text-gray-500">Add signatures to PDF documents</div>
                        </div>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Company Pages */}
                <li>
                  <div 
                    className="sitemap-node cursor-pointer"
                    style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: colors.company }}
                    onClick={() => toggleNode('company')}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">Company</span>
                      <span className="ml-2">{expandedNodes.company ? '−' : '+'}</span>
                    </div>
                    <div className="text-xs text-gray-500">Company information pages</div>
                  </div>
                  
                  {expandedNodes.company && (
                    <ul>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: colors.company }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">About Us</span>
                            <span className="text-sm text-gray-500 ml-2">/about</span>
                          </div>
                          <div className="text-xs text-gray-500">Company information</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: colors.company }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Pricing</span>
                            <span className="text-sm text-gray-500 ml-2">/pricing</span>
                          </div>
                          <div className="text-xs text-gray-500">Subscription plans</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: colors.company }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Features</span>
                            <span className="text-sm text-gray-500 ml-2">/features</span>
                          </div>
                          <div className="text-xs text-gray-500">Product features overview</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: colors.company }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">API Documentation</span>
                            <span className="text-sm text-gray-500 ml-2">/api-docs</span>
                          </div>
                          <div className="text-xs text-gray-500">Developer API information</div>
                        </div>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Support Pages */}
                <li>
                  <div 
                    className="sitemap-node cursor-pointer"
                    style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.support }}
                    onClick={() => toggleNode('support')}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">Support</span>
                      <span className="ml-2">{expandedNodes.support ? '−' : '+'}</span>
                    </div>
                    <div className="text-xs text-gray-500">Help and legal pages</div>
                  </div>
                  
                  {expandedNodes.support && (
                    <ul>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.support }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Contact</span>
                            <span className="text-sm text-gray-500 ml-2">/contact</span>
                          </div>
                          <div className="text-xs text-gray-500">Contact information</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.support }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Terms of Service</span>
                            <span className="text-sm text-gray-500 ml-2">/terms</span>
                          </div>
                          <div className="text-xs text-gray-500">Legal terms and conditions</div>
                        </div>
                      </li>
                      <li>
                        <div 
                          className="sitemap-node"
                          style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.support }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">Privacy Policy</span>
                            <span className="text-sm text-gray-500 ml-2">/privacy</span>
                          </div>
                          <div className="text-xs text-gray-500">Privacy information</div>
                        </div>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        
        {/* API Routes Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">API Routes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-2 text-left border">Endpoint</th>
                  <th className="p-2 text-left border">Method</th>
                  <th className="p-2 text-left border">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/convert</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Convert files between formats</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/compress</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Compress PDF files</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/merge</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Merge multiple PDFs</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/split</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Split PDF into multiple files</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/pdf/sign</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Add signature to PDF</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/pdf/protect</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Add password protection to PDF</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/pdf/unlock</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Remove password protection from PDF</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/rotate</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Rotate PDF pages</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/watermark</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Add watermark to PDF</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/ocr/extract</td>
                  <td className="p-2 border">POST</td>
                  <td className="p-2 border">Extract text from PDF using OCR</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono text-sm">/api/file</td>
                  <td className="p-2 border">GET</td>
                  <td className="p-2 border">Download processed files</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .sitemap {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .sitemap ul {
          list-style: none;
          margin-left: 2rem;
          padding: 0;
        }
        
        .sitemap li {
          margin: 0.5rem 0;
          position: relative;
        }
        
        .sitemap li::before {
          content: "";
          position: absolute;
          left: -1rem;
          top: 0.75rem;
          width: 0.75rem;
          height: 1px;
          background: #ccc;
        }
        
        .sitemap > li::before {
          display: none;
        }
        
        .sitemap li:not(:first-child)::after {
          content: "";
          position: absolute;
          left: -1rem;
          top: -0.5rem;
          height: 100%;
          width: 1px;
          background: #ccc;
        }
        
        .sitemap-node {
          padding: 0.75rem;
          border-radius: 0.25rem;
          border-left: 3px solid;
          margin-bottom: 0.25rem;
        }
        
        .sitemap-root {
          border-left-width: 5px;
        }
      `}</style>
    </div>
  );
};

export default Sitemap;