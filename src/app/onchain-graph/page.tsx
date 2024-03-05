'use client';
import React from 'react';
import { resetCachedUserInputs } from '../../hooks/useSearchInput';
import { init } from '@airstack/airstack-react';
import { apiKey } from '@/constants';
import { OnChainGraphPage } from '@/pages/OnchainGraph';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function Home() {
  resetCachedUserInputs();
  return <OnChainGraphPage />;
}
