import { tokenBlockchains } from '../../constants';

const getTokenSentSubQuery = (blockchain: string) => {
  return `${blockchain}: TokenTransfers(
    input: {filter: {from: {_eq: $from}, _and: {to: {_eq: $to}}}, blockchain: ${blockchain}, limit: 200}
  ) {
    TokenTransfer {
      account: to {
        addresses
      }
    }
  }`;
};

export const tokenSentQuery = `query TokenSent($from: Identity!, $to: Identity!) {
  ${tokenBlockchains
    .map(blockchain => getTokenSentSubQuery(blockchain))
    .join('\n')}
}`;
