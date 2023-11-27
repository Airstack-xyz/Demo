import { useQuery } from "../useQuery.js";
const query = `query GetWalletENS($identity: Identity!, $blockchain: TokenBlockchain!) {
  Wallet(input: {identity: $identity, blockchain: $blockchain}) {
    primaryDomain {
      name
      dappName
    }
    domains {
      name
      owner
      parent
      subDomainCount
      subDomains {
        name
        owner
        parent
      }
      tokenId
      blockchain
      dappName
      resolvedAddress
      isPrimary
      expiryTimestamp
    }
  }
}`;
function useGetWalletENS(variables) {
  return useQuery(query, variables);
}
export {
  useGetWalletENS
};
