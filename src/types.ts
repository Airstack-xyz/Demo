import { QueryType } from '../__generated__/types';
import { snapshotBlockchains, tokenBlockchains } from './constants';

// Please don't update it since it is derived type
// Used for blockchain type based on actual tokenBlockchains
export type TokenBlockchain = (typeof tokenBlockchains)[number];

// Please don't update it since it is derived type
// Used for blockchain type based on actual snapshotsBlockchains
export type SnapshotBlockchain = (typeof snapshotBlockchains)[number];

export enum CSVDownloadStatus {
  pending = 'pending',
  in_progress = 'in_progress',
  paused = 'paused',
  cancelled = 'cancelled',
  data_fetched = 'data_fetched',
  calculating_credits = 'calculating_credits',
  completed = 'completed',
  failed = 'failed',
  credit_calculation_failed = 'credit_calculation_failed'
}

export type CSVDownloadTask = {
  id: number;
  status: CSVDownloadStatus;
  csv_url: string | null;
  query: string;
  variables: object | null;
  filters: object | null;
  rows_limit: number | null;
  name: string;
  downloaded_at: Date | null;
  created_at: Date;
  updated_at: Date;
  retry_count: number;
  user_id: string;
  user_key: string;
};

export type CSVDownloadOption = {
  label: string;
  key: QueryType;
  fileName: string;
  variables: object;
  filters?: Record<string, string | boolean | string[]>;
};
