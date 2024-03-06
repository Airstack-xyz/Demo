'use client';
import React from 'react';
import { apiKey } from '@/constants';
import { init } from '@airstack/airstack-react';
import { HomePage } from '@/pages/Home/page';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function Home() {
  return <HomePage />;
}
