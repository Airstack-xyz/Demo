'use client';
import React, { Suspense } from 'react';
import { resetCachedUserInputs } from '../../hooks/useSearchInput';
import { init } from '@airstack/airstack-react';
import { apiKey } from '@/constants';
import { OnChainGraphPage } from '@/page-views/OnchainGraph';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function Home() {
  resetCachedUserInputs();
  return (
    <Suspense>
      <OnChainGraphPage />
    </Suspense>
  );
}
