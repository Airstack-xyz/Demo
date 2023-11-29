export const commonPoapsQuery = `query GetPOAPs($identity1: Identity!, $identity2: Identity!) {
  Poaps(input: {filter: {owner: {_eq: $identity1}}, blockchain: ALL, limit: 200}) {
    Poap {
      poapEvent {
        poaps(input: {filter: {owner: {_eq: $identity2}}}) {
          tokenAddress
        }
      }
    }
  }
}`;
