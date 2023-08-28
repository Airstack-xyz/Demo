import { TokenHolder } from '../store/tokenHoldersOverview';

export function sortByAddressByNonERC20First(
  address: string[],
  overviewTokens: TokenHolder[],
  // remove this later as this is not being used
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  _shouldFetchPoaps: boolean
) {
  if (overviewTokens.length > 0) {
    if (overviewTokens.length === 0) return [];

    // sort tokens by holders count so that the token with the least holders is the first one
    const sortedAddress = (overviewTokens as TokenHolder[]).sort(
      (a, b) => a.holdersCount - b.holdersCount
    );

    const ercTokens: TokenHolder[] = [],
      otherTokens: TokenHolder[] = [];

    sortedAddress.forEach(token => {
      if (token.tokenType === 'ERC20') {
        ercTokens.push(token);
      } else {
        otherTokens.push(token);
      }
    });
    // ERC20 tokens mostly have a large number of holders so keep it at the end of array so they are always in the inner query
    return [...otherTokens, ...ercTokens].map(_token => ({
      address: _token.tokenAddress.toLowerCase(),
      blockchain: _token.blockchain
    }));
  }

  return address.map(address => ({
    address: address.toLowerCase(),
    blockchain: 'ethereum'
  }));
}
