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
  poapAddresses,
  index = 0
}: {
  poapAddresses: TokenAddress[];
  index?: number;
}): string {
  const children =
    poapAddresses.length - 1 === index
      ? fields
      : getQueryWithFilter({ poapAddresses, index: index + 1 });
  return `owner {
        poaps(
          input: {filter: {eventId: {_eq: "${poapAddresses[index].address}"}}, blockchain: ALL}
        ) {
            ${children}
          }
        }`;
}

export function getCommonOwnersPOAPsQuery({
  poapAddresses
}: {
  poapAddresses: TokenAddress[];
}) {
  if (poapAddresses.length === 0) return '';
  const children =
    poapAddresses.length === 1
      ? fields
      : getQueryWithFilter({ poapAddresses, index: 1 });
  return `query GetPoapHolders($limit: Int) {
    Poaps(
      input: {filter: {eventId: {_eq: "${poapAddresses[0].address}"}}, blockchain: ALL, limit: $limit}
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
