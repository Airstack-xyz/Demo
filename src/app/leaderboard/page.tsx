'use client';
import Leaderboard from '@/page-views/Leaderboard/Leaderboard';
import { Suspense } from 'react';

export default function LeaderboardPage() {
  return (
    <Suspense>
      <Leaderboard />
    </Suspense>
  );
}
