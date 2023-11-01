const getAccountsSubQuery = (blockchain: string) => {
  return `${blockchain}: Accounts(
    input: {blockchain: ${blockchain}, filter: {address: {_eq: $accountAddress}}}
  ) {
    Account {
      tokenId
      blockchain
      tokenAddress
      nft {
        tokenBalances {
          tokenId
          blockchain
          tokenAddress
          owner{
            identity
          }
        }
      }
    }
  }`;
};

export const accountOwnerQuery = `query AccountQuery($accountAddress: Identity) {
  ${getAccountsSubQuery('ethereum')}
  ${getAccountsSubQuery('polygon')}
  ${getAccountsSubQuery('base')}
}`;
