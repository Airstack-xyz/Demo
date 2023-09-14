export interface TokenHoldersResponse {
  TokenBalances: TokenBalances;
}

export interface TokenBalances {
  TokenBalance: TokenBalance[];
}

export interface TokenBalance {
  owner: Owner;
}

export interface Owner {
  identity: string;
}
