import { TokenHolders } from '../store/tokenHoldersOverview';

export function getNFTQueryForTokensHolder(
  address: string[],
  overviewTokens: TokenHolders[],
  shouldFetchPoaps: boolean
) {
  const hasEitherAddressOrEvent =
    shouldFetchPoaps || address.every(address => address.startsWith('0x'));

  if (hasEitherAddressOrEvent) {
    if (overviewTokens.length === 0) return [];

    // sort tokens by holders count so that the token with the least holders is the first one
    const sortedAddress = (overviewTokens as TokenHolders[]).sort(
      (a, b) => a.holdersCount - b.holdersCount
    );

    const ercTokens: TokenHolders[] = [],
      otherTokens: TokenHolders[] = [];

    sortedAddress.forEach(token => {
      if (token.tokenType === 'ERC20') {
        ercTokens.push(token);
      } else {
        otherTokens.push(token);
      }
    });
    // ERC20 tokens mostly have a large number of holders so keep it at the end of array so they are always in the inner query
    return [...otherTokens, ...ercTokens].map(_token =>
      _token.tokenAddress.toLowerCase()
    );
  }
  return address;
}
