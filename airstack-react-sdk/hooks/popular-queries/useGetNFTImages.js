import { useQuery } from "../useQuery.js";
const query = `query GetNFTImages($address: Address!, $tokenId: String!, $blockchain: TokenBlockchain!) {
  TokenNft(input: {address: $address, tokenId: $tokenId, blockchain: $blockchain}) {
    contentValue {
      image {
        original
        extraSmall
        large
        medium
        small
      }
    }
  }
}`;
function useGetNFTImages(variables) {
  return useQuery(query, variables);
}
export {
  useGetNFTImages
};
