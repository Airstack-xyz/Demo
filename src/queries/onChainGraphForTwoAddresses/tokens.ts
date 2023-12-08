import { tokenBlockchains } from '../../constants';

const getTokenSentSubQuery = (blockchain: string) => {
  return `${blockchain}: TokenTransfers(
    input: {filter: {from: {_in: $from}, _and: {to: {_in: $to}}}, blockchain: ${blockchain}, limit: 200}
  ) {
    TokenTransfer {
      account: to {
        addresses
      }
    }
  }`;
};

export const tokenSentQuery = `query TokenSent($from: [Identity!], $to: [Identity!]) {
  ${tokenBlockchains
    .map(blockchain => getTokenSentSubQuery(blockchain))
    .join('\n')}
}`;
