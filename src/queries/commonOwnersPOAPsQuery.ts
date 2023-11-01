import { TokenAddress } from '../pages/TokenHolders/types';

const fields = `id
blockchain
tokenId
tokenAddress
eventId
poapEvent {
  contentValue {
    image {
      original
      medium
      large
      extraSmall
      small
    }
    video
    audio
  }
  logo: contentValue {
    image {
      small
      medium
    }
  }
  blockchain
  eventName
}
owner {
  identity
  addresses
  socials {
    blockchain
    dappSlug
    profileName
  }
  primaryDomain {
    name
  }
  domains {
    chainId
    dappName
    name
  }
  xmtp {
    isXMTPEnabled
  }
}`;

function getQueryWithFilter(tokenIds: TokenAddress[], index = 0): string {
  const children =
    tokenIds.length - 1 === index
      ? fields
      : getQueryWithFilter(tokenIds, index + 1);
  return `owner {
        poaps(
          input: {filter: {eventId: {_eq: "${tokenIds[index].address}"}}, blockchain: ALL}
        ) {
            ${children}
          }
        }`;
}

export function getCommonOwnersPOAPsQuery(tokenIds: TokenAddress[]) {
  if (tokenIds.length === 0) return '';
  const children =
    tokenIds.length === 1 ? fields : getQueryWithFilter(tokenIds, 1);
  return `query GetPoapHolders($limit: Int) {
    Poaps(
      input: {filter: {eventId: {_eq: "${tokenIds[0].address}"}}, blockchain: ALL, limit: $limit}
    ) {
      Poap {
        tokenId
        tokenAddress
        blockchain
        eventId
        poapEvent {
          contentValue {
            image {
              small
            }
            video
            audio
          }
          logo: contentValue {
            image {
              small
            }
          }
        }
        ${children}
      }
    } 
  }`;
}
