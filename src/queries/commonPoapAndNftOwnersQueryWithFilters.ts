const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

export function getCommonPoapAndNftOwnersQueryWithFilters(
  eventId: string,
  tokenId: string,
  hasSocialFilters = false,
  hasPrimaryDomainFilter = false
) {
  return `query CommonPoapAndNftOwners($limit: Int${
    hasSocialFilters ? ', $socialFilters: [SocialDappName!]' : ''
  }${hasPrimaryDomainFilter ? ', $hasPrimaryDomain: Boolean' : ''}) {
    Poaps(
      input: {filter: {eventId: {_eq: "${eventId}"}}, blockchain: ALL, limit: $limit}
    ) {
      Poap { 
        owner {
          tokenBalances(input: {filter: {tokenAddress: {_eq: "${tokenId}"}}}) {
            tokenId
            tokenAddress
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
