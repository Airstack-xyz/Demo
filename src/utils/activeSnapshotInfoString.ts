import { SnapshotFilterType } from '../Components/Filters/SnapshotFilter';

export function getActiveSnapshotInfoString({
  blockNumber,
  date,
  timestamp
}: {
  blockNumber?: string | number;
  date?: string;
  timestamp?: string | number;
}) {
  return `${blockNumber || ''}│${date || ''}│${timestamp || ''}`;
}

export function getActiveSnapshotInfo(activeTokenInfo?: string) {
  const [blockNumber, date, timestamp] = activeTokenInfo?.split('│') ?? [];

  let appliedFilter: SnapshotFilterType = 'today';
  if (blockNumber) {
    appliedFilter = 'blockNumber';
  } else if (date) {
    appliedFilter = 'customDate';
  } else if (timestamp) {
    appliedFilter = 'timestamp';
  }

  return {
    isApplicable: appliedFilter !== 'today',
    appliedFilter,
    blockNumber: blockNumber ? Number(blockNumber) : undefined,
    date: date || undefined,
    timestamp: timestamp ? Number(timestamp) : undefined
  };
}
