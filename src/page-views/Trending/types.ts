import {
  GetTrendingMintsQuery,
  GetTrendingTokensQuery
} from '../../../__generated__/airstack-types';

export type TrendingMint = NonNullable<
  NonNullable<GetTrendingMintsQuery['TrendingMints']>['TrendingMint']
>[0];

export type TrendingToken = NonNullable<
  NonNullable<GetTrendingTokensQuery['TrendingTokens']>['TrendingToken']
>[0];
