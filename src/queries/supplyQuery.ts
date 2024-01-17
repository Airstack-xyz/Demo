import { tokenBlockchains } from '../constants';

export const POAPSupplyQuery = `query PoapTotalSupply($eventId: String!) {
    PoapEvents(input: {filter: {eventId: {_eq: $eventId}}, blockchain: ALL}) {
      PoapEvent {
        tokenMints
      }
    }
  }`;

const getTokenTotalSupplySubQuery = (blockchain: string) => {
  return `${blockchain}: Token(input: {address: $tokenAddress, blockchain: ${blockchain}}) {
        totalSupply
      }`;
};

export const TokenSupplyQuery = `query TokenTotalSupply($tokenAddress: Address!) {
      ${tokenBlockchains
        .map(blockchain => getTokenTotalSupplySubQuery(blockchain))
        .join('\n')}
    }`;
