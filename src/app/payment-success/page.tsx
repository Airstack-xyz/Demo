'use client';

import { AuthProvider } from '@/context/auth';
import PaymentSuccess from '@/page-views/PaymentSuccess';
import { Suspense } from 'react';

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <AuthProvider>
        <PaymentSuccess />
      </AuthProvider>
    </Suspense>
  );
}
