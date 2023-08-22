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

function getQueryWithFiter(
  tokenids: string[],
  index = 0,
  hasSocialFilters: boolean,
  hasPrimaryDomainFilter: boolean
): string {
  const children =
    tokenids.length - 1 === index
      ? getFields(hasSocialFilters, hasPrimaryDomainFilter)
      : getQueryWithFiter(
          tokenids,
          index + 1,
          hasSocialFilters,
          hasPrimaryDomainFilter
        );
  return `owner {
          poaps(
            input: {filter: {eventId: {_eq: "${tokenids[index]}"}}}
          ) {
              ${children}
            }
          }`;
}

export function getFilterablePoapsQuery(
  tokenIds: string[],
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) {
  if (tokenIds.length === 0) return '';
  const childern =
    tokenIds.length === 1
      ? getFields(hasSocialFilters, hasPrimaryDomainFilter)
      : getQueryWithFiter(
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
          tokenIds[0]
        }"}}, blockchain: ALL, limit: $limit}
      ) {
        Poap {
          ${childern}
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
