import { TokenAddress } from '../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

export function getCommonPoapAndNftOwnersQueryWithFilters(
  eventId: TokenAddress,
  tokenId: TokenAddress,
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) {
  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomainFilter) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  return `query CommonPoapAndNftOwners(${variablesString}) {
    Poaps(
      input: {filter: {eventId: {_eq: "${
        eventId.address
      }"}}, blockchain: ALL, limit: $limit}
    ) {
      Poap { 
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${
            tokenId.address
          }"}}, blockchain: ${tokenId.blockchain}}) {
            tokenId
            tokenAddress
            tokenType
            formattedAmount
            token {
              logo {
                small
              }
              projectDetails {
                imageUrl
              }
            }
            owner {
              identity
              addresses
              socials${hasSocialFilters ? socialInput : ''} {
                blockchain
                dappSlug
                dappName
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
            }
          }
        }
      }
    }
  }`;
}
