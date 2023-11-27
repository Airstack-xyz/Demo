import { useLazyQueryWithPagination } from "../useQueryWithPagination.js";
const query = `query GetNFTTransfers($tokenAddress: Address, $tokenId: String, $blockchain: TokenBlockchain!, $limit: Int) {
  TokenTransfers(
    input: {filter: {tokenId: {_eq: $tokenId}, tokenAddress: {_eq: $tokenAddress}}, blockchain: $blockchain, limit: $limit}
  ) {
    TokenTransfer {
      amount
      blockNumber
      blockTimestamp
      from {
        addresses
      }
      to {
        addresses
      }
      tokenAddress
      transactionHash
      tokenId
      tokenType
      blockchain
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;
function useGetNFTTransfers(variables) {
  return useLazyQueryWithPagination(query, variables);
}
export {
  useGetNFTTransfers
};
