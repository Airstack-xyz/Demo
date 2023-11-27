import { useLazyQueryWithPagination } from "../useQueryWithPagination.js";
const query = `query GetNFTs($address: Address!, $blockchain: TokenBlockchain!, $limit: Int) {
  TokenNfts(
    input: {blockchain: $blockchain, limit: $limit, filter: {address: {_eq: $address}}}
  ) {
    TokenNft {
      address
      blockchain
      contentType
      contentValue {
        animation_url {
          original
        }
        image {
          extraSmall
          medium
          large
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
      metaData {
        animationUrl
        backgroundColor
        attributes {
          displayType
          maxValue
          value
          trait_type
        }
        description
        externalUrl
        image
        imageData
        youtubeUrl
        name
      }
      tokenURI
      type
      tokenId
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;
function useGetNFTs(variables) {
  return useLazyQueryWithPagination(query, variables);
}
export {
  useGetNFTs
};
