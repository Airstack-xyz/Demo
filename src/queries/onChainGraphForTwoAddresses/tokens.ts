import { tokenBlockchains } from '../../constants';
import { capitalizeFirstLetter } from '../../utils';

const getTokenSentSubQuery = (blockchain: string) => {
  return `${capitalizeFirstLetter(blockchain)}: TokenTransfers(
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
