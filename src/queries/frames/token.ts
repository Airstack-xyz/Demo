export const getTokenDecimalsQuery = /* GraphQL */ `
  query GetTokenDecimals($address: Address) {
    Tokens(
      input: { filter: { address: { _eq: $address } }, blockchain: base }
    ) {
      Token {
        decimals
      }
    }
  }
`;
