import { GetTrendingMintsQuery } from "../../../../__generated__/airstack-types";

export type TrendingMint = NonNullable<
  NonNullable<
    GetTrendingMintsQuery["TrendingMints"]
  >['TrendingMint']
>[0];
