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
  return `${blockNumber || ''} ${date || ''} ${timestamp || ''}`;
}

export function getActiveSnapshotInfo(activeTokenInfo?: string) {
  const [blockNumber, date, timestamp] = activeTokenInfo?.split(' ') ?? [];

  let appliedFilter = SnapshotFilterType.TODAY;
  if (blockNumber) {
    appliedFilter = SnapshotFilterType.BLOCK_NUMBER;
  } else if (date) {
    appliedFilter = SnapshotFilterType.CUSTOM_DATE;
  } else if (timestamp) {
    appliedFilter = SnapshotFilterType.TIMESTAMP;
  }

  return {
    isApplicable: appliedFilter !== SnapshotFilterType.TODAY,
    appliedFilter,
    blockNumber: blockNumber ? Number(blockNumber) : undefined,
    date: date || undefined,
    timestamp: timestamp ? Number(timestamp) : undefined
  };
}
