import { fetchGql } from "../utils/fetcher.js";
const query = `query GetTokenNfts($address: Address, $tokenId: String, $blockchain: TokenBlockchain!) {
    TokenNfts(input: {filter: {address: {_eq: $address}, tokenId: {_eq: $tokenId}}, blockchain: $blockchain}) {
      TokenNft {
        tokenId
        contentType
        contentValue {
          video {
            original
          }
          audio {
            original
          }
          image {
            extraSmall
            large
            medium
            original
            small
          }
          animation_url {
            original
          }
        }
      }
    }
  }
`;
function getNftContent(chainId, address, tokenId) {
  return fetchGql(query, {
    blockchain: chainId,
    address,
    tokenId
  });
}
export {
  getNftContent
};
