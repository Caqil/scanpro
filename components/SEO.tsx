// components/SEO.tsx
import React from 'react';
import Head from 'next/head';
import { generateScanProSchemas } from '@/lib/seo/schemas';

interface SeoProps {
  schemas?: any[];
  children?: React.ReactNode;
}

export function SEO({ 
  schemas = generateScanProSchemas(), 
  children 
}: SeoProps) {
  return (
    <Head>
      {/* JSON-LD Schemas */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(schema, null, 2) 
          }}
        />
      ))}
      
      {/* Additional head elements can be passed as children */}
      {children}
    </Head>
  );
}