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
          domains {
            name
            isPrimary
          }
          socials {
            dappName
            blockchain
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
  }`;
