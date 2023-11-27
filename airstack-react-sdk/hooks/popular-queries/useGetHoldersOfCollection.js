import { useLazyQueryWithPagination } from "../useQueryWithPagination.js";
const query = `query GetHoldersOfCollection($tokenAddress: Address, $blockchain: TokenBlockchain!, $limit: Int) {
  TokenBalances(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: $blockchain, limit: $limit}
  ) {
    TokenBalance {
      token {
        name
        symbol
        decimals
      }
      tokenId
      tokenType
      tokenNfts {
        contentType
        contentValue {
          animation_url {
            original
          }
          image {
            extraSmall
            large
            medium
            original
            small
          }
          video {
            original
          }
          audio {
            original
          }
        }
      }
      owner {
        addresses
        primaryDomain {
          name
          resolvedAddress
        }
        domains {
          name
          owner
        }
        socials {
          dappName
          profileName
          userAddress
          userAssociatedAddresses
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;
function useGetHoldersOfCollectionOfTokenCollection(variables) {
  return useLazyQueryWithPagination(query, variables);
}
export {
  useGetHoldersOfCollectionOfTokenCollection
};
