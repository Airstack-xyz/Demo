export const nftAddressesQuery = `query UserNFTAddresses($user: Identity!, $blockchain: TokenBlockchain!) {
  TokenBalances(input: {filter: {tokenType: {_in: [ERC721]}, owner: {_eq: $user}}, blockchain: $blockchain, limit: 200}) {
    TokenBalance {
      tokenAddress
    }
  }
}`;

export const nftQuery = `query NFTs($addresses: [Address!], $blockchain: TokenBlockchain!, $limit: Int) {
    TokenBalances(
      input: {filter: {tokenAddress: {_in: $addresses}, tokenType: {_in: [ERC721]}}, blockchain: $blockchain, limit: $limit}
    ) {
      TokenBalance {
        token {
          name
          address
          tokenNfts {
            tokenId
          }
          blockchain
          logo {
            small
          }
        }
        owner {
          addresses
          primaryDomain {
            name
            tokenNft {
              tokenId
              address
              blockchain
            }
          }
          domains {
            name
            isPrimary
            tokenNft {
              tokenId
              address
              blockchain
            }
          }
          socials {
            dappName
            blockchain
            profileName
            profileHandle
            profileImage
            profileTokenId
            profileTokenAddress
            profileImageContentValue {
              image {
                small
              }
            }
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
  }`;
