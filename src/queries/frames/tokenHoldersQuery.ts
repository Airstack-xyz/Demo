export const GetTokenHoldersQuery = `query GetTokenHolders($address: Address!, $blockchain: TokenBlockchain!, $limit: Int) {
    TokenBalances(
      input: {filter: {tokenAddress: {_eq: $address}}, blockchain: $blockchain, limit: $limit, order: {lastUpdatedTimestamp: DESC}}
    ) {
      TokenBalance {
        amount
        formattedAmount
        blockchain
        tokenType
        tokenId
        tokenAddress
        tokenNfts {
          contentValue {
            image {
              small
            }
          }
        }
        token {
          name
          symbol
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        owner {
          identity
          primaryDomain {
            name
            avatar
          }
          domains(input: {filter: {isPrimary: {_eq: false}}, limit: 1}) {
            name
            avatar
          }
          farcasterSocials: socials(
            input: {filter: {dappName: {_eq: farcaster}}, limit: 1}
          ) {
            profileName
            profileImage
            profileImageContentValue {
              image {
                small
              }
            }
          }
          lensSocials: socials(input: {filter: {dappName: {_eq: lens}}, limit: 1}) {
            profileName
            profileImage
            profileImageContentValue {
              image {
                small
              }
            }
          }
        }
      }
    }
  }`;

export const GetPoapHoldersQuery = `query GetPoapHolders($address: String!, $limit: Int) {
    Poaps(
      input: {filter: {eventId: {_eq: $address}}, limit: $limit, blockchain: ALL, order: {createdAtBlockNumber: DESC}}
    ) {
      Poap {
        blockchain
        tokenId
        tokenAddress
        poapEvent {
          city
          eventName
          startDate
          eventId
          contentValue {
            image {
              small
            }
          }
        }
        owner {
          identity
          primaryDomain {
            name
            avatar
          }
          domains(input: {filter: {isPrimary: {_eq: false}}, limit: 1}) {
            name
            avatar
          }
          farcasterSocials: socials(
            input: {filter: {dappName: {_eq: farcaster}}, limit: 1}
          ) {
            profileName
            profileImage
            profileImageContentValue {
              image {
                small
              }
            }
          }
          lensSocials: socials(input: {filter: {dappName: {_eq: lens}}, limit: 1}) {
            profileName
            profileImage
            profileImageContentValue {
              image {
                small
              }
            }
          }
        }
      }
    }
  }`;
