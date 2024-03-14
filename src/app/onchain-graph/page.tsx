'use client';
import React, { Suspense } from 'react';
import { init } from '@airstack/airstack-react';
import { apiKey } from '@/constants';
import { OnChainGraphPage } from '@/page-views/OnchainGraph';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function OnChainGraph() {
  return (
    <Suspense>
      <OnChainGraphPage />
    </Suspense>
  );
}
