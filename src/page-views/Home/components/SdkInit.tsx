'use client';
import { apiKey } from '@/constants';
import { init } from '@airstack/airstack-react';
import { useEffect } from 'react';

export function SdkInit() {
  useEffect(() => {
    init(apiKey, {
      cancelHookRequestsOnUnmount: true
    });
  }, []);

  return null;
}
