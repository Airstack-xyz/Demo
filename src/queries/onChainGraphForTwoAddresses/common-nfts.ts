import { tokenBlockchains } from '../../constants';

const getCommonNFTTokensSubQuery = (blockchain: string) => {
  return `${blockchain}: TokenBalances(
    input: {filter: {owner: {_in: $identity1}, tokenType: {_in: [ERC721]}}, blockchain: ${blockchain}, limit: 200}
  ) {
    TokenBalance {
      tokenAddress
      token {
        tokenBalances(
          input: {filter: {owner: {_in: $identity2}, tokenType: {_in: [ERC721]}}, blockchain: ${blockchain}}
        ) {
          tokenAddress
        }
      }
    }
  }`;
};

export const commonNFTTokens = `query GetTokens($identity1: [Identity!], $identity2: [Identity!]) {
  ${tokenBlockchains
    .map(blockchain => getCommonNFTTokensSubQuery(blockchain))
    .join('\n')}
}`;
