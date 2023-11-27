import { useQuery } from "../useQuery.js";
const query = `query GetTokenTransfers($tokenAddress: Address, $blockchain: TokenBlockchain!, $limit: Int) {
    TokenTransfers(
      input: {filter: { tokenAddress: {_eq: $tokenAddress}}, blockchain: $blockchain, limit: $limit}
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
function useGetTokenTransfers(variables) {
  return useQuery(query, variables);
}
export {
  useGetTokenTransfers
};
