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
    video {
      original
    }
    audio {
      original
    }
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
    dappName
    profileName
    profileHandle
  }
  primaryDomain {
    name
  }
  domains {
    name
  }
  xmtp {
    isXMTPEnabled
  }
}`;

function getQueryWithFilter({
  poaps,
  index = 0
}: {
  poaps: TokenAddress[];
  index?: number;
}): string {
  const children =
    poaps.length - 1 === index
      ? fields
      : getQueryWithFilter({ poaps, index: index + 1 });
  return `owner {
        poaps(
          input: {filter: {eventId: {_eq: "${poaps[index].address}"}}, blockchain: ALL}
        ) {
            ${children}
          }
        }`;
}

export function getCommonOwnersPOAPsQuery({
  poaps
}: {
  poaps: TokenAddress[];
}) {
  if (poaps.length === 0) return '';
  const children =
    poaps.length === 1 ? fields : getQueryWithFilter({ poaps, index: 1 });
  return `query GetPoapHolders($limit: Int) {
    Poaps(
      input: {filter: {eventId: {_eq: "${poaps[0].address}"}}, blockchain: ALL, limit: $limit}
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
            video {
              original
            }
            audio {
              original
            }
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
