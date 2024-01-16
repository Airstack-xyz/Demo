import { TokenAddress } from '../pages/TokenHolders/types';

const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

export function getCommonPoapAndNftOwnersQueryWithFilters({
  poap,
  token,
  hasSocialFilters,
  hasPrimaryDomain
}: {
  poap: TokenAddress;
  token: TokenAddress;
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
      input: {filter: {poap: {_eq: "${
        poap.address
      }"}}, blockchain: ALL, limit: $limit}
    ) {
      Poap { 
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${
            token.address
          }"}}, blockchain: ${token.blockchain || 'ethereum'}}) {
            token
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
                token
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
