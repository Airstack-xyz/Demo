import { useQuery } from "../useQuery.js";
const query = `query GetNFTDetails($address: Address!, $tokenId: String!, $blockchain: TokenBlockchain!) {
  TokenNft(input: {address: $address, tokenId: $tokenId, blockchain: $blockchain}) {
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
    token {
      baseURI
      address
      blockchain
      contractMetaData {
        description
        image
        name
      }
      decimals
      logo {
        large
        medium
        small
        original
      }
      name
      projectDetails {
        collectionName
        description
        imageUrl
      }
      symbol
      totalSupply
      type
    }
  }
}`;
function useGetNFTDetails(variables) {
  return useQuery(query, variables);
}
export {
  useGetNFTDetails
};
