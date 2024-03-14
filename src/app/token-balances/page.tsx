'use client';
import React, { Suspense } from 'react';
import { TokenBalance } from '../../page-views/TokenBalances';
import { init } from '@airstack/airstack-react';
import { apiKey } from '@/constants';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function Home() {
  return (
    <Suspense>
      <TokenBalance />
    </Suspense>
  );
}
