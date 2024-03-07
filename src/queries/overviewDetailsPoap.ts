import { TokenAddress } from '../page-views/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

function getFields({
  hasSocialFilters,
  hasPrimaryDomain
}: {
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  return `id
   blockchain
   tokenId
   tokenAddress
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
     blockchain
     eventName
   }
   owner {
     identity
     addresses
     socials${hasSocialFilters ? socialInput : ''} {
       blockchain
       dappName
       profileName
       profileHandle
     }
     primaryDomain {
       name
     }
     domains${hasPrimaryDomain ? primaryDomainInput : ''} {
       name
     }
     xmtp {
       isXMTPEnabled
     }
   }`;
}

function getQueryWithFilter({
  tokenAddresses,
  index = 0,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddresses: TokenAddress[];
  index?: number;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}): string {
  const children =
    tokenAddresses.length - 1 === index
      ? getFields({ hasSocialFilters, hasPrimaryDomain })
      : getQueryWithFilter({
          tokenAddresses,
          index: index + 1,
          hasSocialFilters,
          hasPrimaryDomain
        });
  return `owner {
          poaps(
            input: {filter: {eventId: {_eq: "${tokenAddresses[index].address}"}}, blockchain: ALL }
          ) {
              ${children}
            }
          }`;
}

export function getFilterablePoapsQuery({
  tokenAddresses,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokenAddresses: TokenAddress[];
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  if (tokenAddresses.length === 0) return '';

  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const children =
    tokenAddresses.length === 1
      ? getFields({ hasSocialFilters, hasPrimaryDomain })
      : getQueryWithFilter({
          tokenAddresses,
          index: 1,
          hasSocialFilters,
          hasPrimaryDomain
        });

  return `query GetPoapHolders(${variablesString}) {
      Poaps(
        input: {filter: {eventId: {_eq: "${tokenAddresses[0].address}"}}, blockchain: ALL, limit: $limit}
      ) {
        Poap {
          ${children}
          poapEvent {
            logo: contentValue {
              image {
                small
              }
            }
          }
        }
      } 
    }`;
}
