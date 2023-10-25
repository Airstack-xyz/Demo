export const tokenSentQuery = `query TokenSent($from: Identity!, $to: Identity!) {
    Ethereum: TokenTransfers(
      input: {filter: {from: {_eq: $from}, _and: {to: {_eq: $to}}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: to {
          addresses
        }
      }
    }
    Polygon: TokenTransfers(
      input:{filter: {from: {_eq: $from}, _and: {to: {_eq: $to}}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: to {
          addresses
        }
      }
    }
  }`;
