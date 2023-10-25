export const commonPoapsQuery = `query GetPOAPs($identity: Identity!, $identity2: Identity!) {
  Poaps(input: {filter: {owner: {_eq: $identity}}, blockchain: ALL, limit: 200}) {
    Poap {
      poapEvent {
        poaps(input: {filter: {owner: {_eq: $identity2}}}) {
          tokenAddress
        }
      }
    }
  }
}`;
