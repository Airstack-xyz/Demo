import { useQuery } from "../useQuery.js";
const query = `query GetPrimaryENS($identity: Identity!, $blockchain: TokenBlockchain!) {
  Wallet(input: {identity: $identity, blockchain: $blockchain}) {
    primaryDomain {
      name
      dappName
      tokenId
      chainId
      blockchain
      labelName
      labelHash
      owner
      parent
    }
  }
}`;
function useGetPrimaryENS(variables) {
  return useQuery(query, variables);
}
export {
  useGetPrimaryENS
};
