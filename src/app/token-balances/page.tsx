'use client';
import React from 'react';
import { resetCachedUserInputs } from '../../hooks/useSearchInput';
import { TokenBalance } from '../../page-views/TokenBalances';
import { init } from '@airstack/airstack-react';
import { apiKey } from '@/constants';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function Home() {
  resetCachedUserInputs();
  return <TokenBalance />;
}
