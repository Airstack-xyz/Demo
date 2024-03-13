'use client';
import { apiKey } from '@/constants';
import { TrendingMintsPage } from '@/page-views/TrendingMints';
import { init } from '@airstack/airstack-react';
import { Suspense } from 'react';
import { resetCachedUserInputs } from '../../hooks/useSearchInput';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function Home() {
  resetCachedUserInputs();
  return (
    <Suspense>
      <TrendingMintsPage />
    </Suspense>
  );
}
