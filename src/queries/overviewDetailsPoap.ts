import { TokenAddress } from '../pages/TokenHolders/types';

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
  tokens,
  index = 0,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokens: TokenAddress[];
  index?: number;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}): string {
  const children =
    tokens.length - 1 === index
      ? getFields({ hasSocialFilters, hasPrimaryDomain })
      : getQueryWithFilter({
          tokens,
          index: index + 1,
          hasSocialFilters,
          hasPrimaryDomain
        });
  return `owner {
          poaps(
            input: {filter: {eventId: {_eq: "${tokens[index].address}"}}, blockchain: ALL }
          ) {
              ${children}
            }
          }`;
}

export function getFilterablePoapsQuery({
  tokens,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  tokens: TokenAddress[];
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  if (tokens.length === 0) return '';

  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  const children =
    tokens.length === 1
      ? getFields({ hasSocialFilters, hasPrimaryDomain })
      : getQueryWithFilter({
          tokens,
          index: 1,
          hasSocialFilters,
          hasPrimaryDomain
        });

  return `query GetPoapHolders(${variablesString}) {
      Poaps(
        input: {filter: {eventId: {_eq: "${tokens[0].address}"}}, blockchain: ALL, limit: $limit}
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
