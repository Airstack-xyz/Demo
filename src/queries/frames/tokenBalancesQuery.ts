import { tokenBlockchains } from '../../constants';

const getTokenBalanceSubQuery = (blockchain: string) => {
  return `${blockchain}: TokenBalances(
    input: {filter: {owner: {_eq: $owner}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}, limit: $limit, order: {lastUpdatedTimestamp: DESC}}
  ) {
    TokenBalance {
      amount
      formattedAmount
      blockchain
      tokenType
      tokenId
      tokenAddress
      tokenNfts {
        tokenId
        contentValue {
          image {
            small
          }
        }
      }
      token {
        name
        symbol
        logo {
          small
        }
        projectDetails {
          imageUrl
        }
      }
    }
  }`;
};

export const tokenBalancesFrameQuery = `query GetFrameTokens($owner: Identity!, $tokenType: [TokenType!], $limit: Int) {
  ${tokenBlockchains
    .map(blockchain => getTokenBalanceSubQuery(blockchain))
    .join('\n')}
  poap: Poaps(
    input: {filter: {owner: {_eq: $owner}}, limit: $limit, blockchain: ALL, order: {createdAtBlockNumber: DESC}}
  ) {
    Poap {
      id
      blockchain
      tokenId
      tokenAddress
      poapEvent {
        city
        eventName
        startDate
        eventId
        contentValue {
          image {
            small
          }
        }
      }
    }
  }
  wallet: Wallet(input: {identity: $owner, blockchain: ethereum}) {
    identity
    primaryDomain {
      name
    }
    domains(input: {filter: {isPrimary: {_eq: false}}, limit: 1}) {
      name
    }
    farcasterSocials: socials(
      input: {filter: {dappName: {_eq: farcaster}}, limit: 1}
    ) {
      profileName
    }
    lensSocials: socials(input: {filter: {dappName: {_eq: lens}}, limit: 1}) {
      profileName
    }
  }
}`;
