import { TokenAddress } from '../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

function getFields(hasSocialFilters = false, hasPrimaryDomainFilter = false) {
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
       video
       audio
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
     domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
       name
     }
     xmtp {
       isXMTPEnabled
     }
   }`;
}

function getQueryWithFilter(
  tokenIds: TokenAddress[],
  index = 0,
  hasSocialFilters: boolean,
  hasPrimaryDomainFilter: boolean
): string {
  const children =
    tokenIds.length - 1 === index
      ? getFields(hasSocialFilters, hasPrimaryDomainFilter)
      : getQueryWithFilter(
          tokenIds,
          index + 1,
          hasSocialFilters,
          hasPrimaryDomainFilter
        );
  return `owner {
          poaps(
            input: {filter: {eventId: {_eq: "${tokenIds[index].address}"}}, blockchain: ALL }
          ) {
              ${children}
            }
          }`;
}

export function getFilterablePoapsQuery(
  tokenIds: TokenAddress[],
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) {
  if (tokenIds.length === 0) return '';

  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomainFilter) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const children =
    tokenIds.length === 1
      ? getFields(hasSocialFilters, hasPrimaryDomainFilter)
      : getQueryWithFilter(
          tokenIds,
          1,
          hasSocialFilters,
          hasPrimaryDomainFilter
        );

  return `query GetPoapHolders(${variablesString}) {
      Poaps(
        input: {filter: {eventId: {_eq: "${tokenIds[0].address}"}}, blockchain: ALL, limit: $limit}
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
