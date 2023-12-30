import { SnapshotFilterType } from '../Components/Filters/SnapshotFilter';
import { snapshotBlockchains } from '../constants';

export function getActiveSnapshotInfoString({
  blockNumber,
  customDate,
  timestamp
}: {
  blockNumber?: string;
  customDate?: string;
  timestamp?: string;
}) {
  return `${blockNumber || ''}│${customDate || ''}│${timestamp || ''}`;
}

export function getActiveSnapshotInfo(activeTokenInfo?: string) {
  const [blockNumber, customDate, timestamp] =
    activeTokenInfo?.split('│') ?? [];

  let appliedFilter: SnapshotFilterType = 'today';
  if (blockNumber) {
    appliedFilter = 'blockNumber';
  } else if (customDate) {
    appliedFilter = 'customDate';
  } else if (timestamp) {
    appliedFilter = 'timestamp';
  }

  return {
    isApplicable: appliedFilter !== 'today',
    appliedFilter,
    blockNumber: blockNumber || '',
    customDate: customDate || '',
    timestamp: timestamp || ''
  };
}

export type SnapshotInfo = ReturnType<typeof getActiveSnapshotInfo>;

export const getSnapshotQueryFilters = (snapshotInfo: SnapshotInfo) => {
  const queryFilters: Record<string, string | number> = {};

  switch (snapshotInfo.appliedFilter) {
    case 'blockNumber':
      queryFilters.blockNumber = Number(snapshotInfo.blockNumber);
      break;
    case 'customDate':
      queryFilters.customDate = snapshotInfo.customDate;
      break;
    case 'timestamp':
      queryFilters.timestamp = Number(snapshotInfo.timestamp);
      break;
  }

  return queryFilters;
};

export const checkBlockchainSupportForSnapshot = (chain: string) => {
  return snapshotBlockchains.findIndex(_chain => _chain === chain) !== -1;
};
