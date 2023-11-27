import { useQuery } from "../useQuery.js";
const query = `query GetWalletENSAndSocial($identity: Identity!, $blockchain: TokenBlockchain!) {
  Wallet(input: {identity: $identity, blockchain: $blockchain}) {
    domains {
      dappName
      owner
      isPrimary
    }
    socials {
      dappName
      profileName
      profileTokenAddress
      profileTokenId
      userId
      chainId
      blockchain
    }
  }
}`;
function useGetWalletENSAndSocial(variables) {
  return useQuery(query, variables);
}
export {
  useGetWalletENSAndSocial
};
