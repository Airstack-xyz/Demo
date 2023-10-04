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
       dappSlug
       profileName
     }
     primaryDomain {
       name
     }
     domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
       chainId
       dappName
       name
     }
     xmtp {
       isXMTPEnabled
     }
   }`;
}

// export const getFilterablePoapsQuery = (
//   hasSocialFilters = false,
//   hasPrimaryDomainFilter = false
// ) => {
//   return `query GetPoapHolders($eventId: [String!], $limit: Int${
//     hasSocialFilters ? ', $socialFilters: [SocialDappName!]' : ''
//   }${hasPrimaryDomainFilter ? ', $hasPrimaryDomain: Boolean' : ''}) {
//       Poaps(input: {filter: {eventId: {_in: $eventId}}, blockchain: ALL, limit: $limit}) {
//         Poap {
//           id
//           blockchain
//           tokenId
//           tokenAddress
//           eventId
//           poapEvent {
//             contentValue {
//               image {
//                 small
//               }
//               video
//               audio
//             }
//             logo: contentValue {
//               image {
//                 small
//               }
//             }
//             blockchain
//             eventName
//           }
//           owner {
//             identity
//             addresses
//             socials${hasSocialFilters ? socialInput : ''} {
//               blockchain
//               dappSlug
//               profileName
//             }
//             primaryDomain {
//               name
//             }
//             domains${hasPrimaryDomainFilter ? primaryDomainInput : ''} {
//               chainId
//               dappName
//               name
//             }
//             xmtp {
//               isXMTPEnabled
//             }
//           }
//         }
//         pageInfo {
//           nextCursor
//           prevCursor
//         }
//       }
//     }`;
// };

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
  const children =
    tokenIds.length === 1
      ? getFields(hasSocialFilters, hasPrimaryDomainFilter)
      : getQueryWithFilter(
          tokenIds,
          1,
          hasSocialFilters,
          hasPrimaryDomainFilter
        );
  return `query GetPoapHolders($limit: Int${
    hasSocialFilters ? ', $socialFilters: [SocialDappName!]' : ''
  }${hasPrimaryDomainFilter ? ', $hasPrimaryDomain: Boolean' : ''}) {
      Poaps(
        input: {filter: {eventId: {_eq: "${
          tokenIds[0].address
        }"}}, blockchain: ALL, limit: $limit}
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
