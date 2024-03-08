'use client';
import React from 'react';
import { init } from '@airstack/airstack-react';
import { apiKey } from '@/constants';
import { TokenHolders } from '@/page-views/TokenHolders';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function TokenHoldersPage() {
  return <TokenHolders />;
}
