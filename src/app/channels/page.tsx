'use client';
import React from 'react';
import { init } from '@airstack/airstack-react';
import { apiKey } from '@/constants';
import { Channels } from '@/page-views/Channels';

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

export default function ChannelsPage() {
  return <Channels />;
}
