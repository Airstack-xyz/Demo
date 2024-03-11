import { TokenAddress } from '../page-views/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

export function getCommonPoapAndNftOwnersQueryWithFilters({
  poapAddress,
  tokenAddress,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  poapAddress: TokenAddress;
  tokenAddress: TokenAddress;
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
}) {
  const variables = ['$limit: Int'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  return `query CommonPoapAndNftOwners(${variablesString}) {
    Poaps(
      input: {filter: {eventId: {_eq: "${
        poapAddress.address
      }"}}, blockchain: ALL, limit: $limit}
    ) {
      Poap { 
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${
            tokenAddress.address
          }"}}, blockchain: ${tokenAddress.blockchain || 'ethereum'}}) {
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
              blockchain
              accounts {
                tokenId
                tokenAddress
              }
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
            }
          }
        }
      }
    }
  }`;
}
