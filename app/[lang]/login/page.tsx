// app/[lang]/login/page.tsx
"use client";

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginFormWrapper />
      </Suspense>
    </div>
  );
}

function LoginFormWrapper() {
  const params = useParams();
  const lang = params?.lang || 'en';
  const callbackUrl = `/${lang}/dashboard`;

  return <LoginForm callbackUrl={callbackUrl} registered={false} />;
}