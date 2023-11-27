import { useQuery } from "../useQuery.js";
const query = `query TokenDetails($address: Address!, $blockchain: TokenBlockchain!) {
  Token(input: {address: $address, blockchain: $blockchain}) {
    name
    symbol
    decimals
    totalSupply
    type
    baseURI
    address
    blockchain
    logo {
      large
      medium
      original
      small
    }
    projectDetails {
      collectionName
      description
      imageUrl
      discordUrl
      externalUrl
      twitterUrl
    }
  }
}`;
function useGetTokenDetails(variables) {
  return useQuery(query, variables);
}
export {
  useGetTokenDetails
};
