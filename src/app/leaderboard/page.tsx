'use client';
import { SdkInit } from '@/page-views/Home/components/SdkInit';
import Leaderboard from '@/page-views/Leaderboard/Leaderboard';
import { Suspense } from 'react';

export default function LeaderboardPage() {
  return (
    <Suspense>
      <SdkInit />
      <Leaderboard />
    </Suspense>
  );
}
