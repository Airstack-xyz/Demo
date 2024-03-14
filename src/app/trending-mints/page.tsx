'use client';
import { apiKey } from '@/constants';
import { TrendingMintsPage } from '@/page-views/TrendingMints';
import { init } from '@airstack/airstack-react';
import { Suspense } from 'react';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function Home() {
  return (
    <Suspense>
      <TrendingMintsPage />
    </Suspense>
  );
}
