import { useQuery } from "../useQuery.js";
const query = `query GetENSSubDomains($owner: Identity, $blockchain: Blockchain!) {
  Domains(input: {filter: {owner: {_eq: $owner}}, blockchain: $blockchain}) {
    Domain {
      subDomains {
        name
        dappName
        tokenId
        chainId
        blockchain
        labelName
        labelHash
        owner
        parent
        expiryTimestamp
        resolvedAddress
      }
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
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;
function useGetENSSubDomains(variables) {
  return useQuery(query, variables);
}
export {
  useGetENSSubDomains
};
