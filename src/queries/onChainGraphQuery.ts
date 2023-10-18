export const getOnChainGraphQuery = ({
  ethereumNfts = true,
  polygonNfts = true,
  poaps = true,
  ethereumTokenTransfers = true,
  polygonTokenTransfers = true,
  lensFollows = true,
  farcasterFollows = true
}: {
  ethereumNfts?: boolean;
  polygonNfts?: boolean;
  poaps?: boolean;
  ethereumTokenTransfers?: boolean;
  polygonTokenTransfers?: boolean;
  lensFollows?: boolean;
  farcasterFollows?: boolean;
}) =>
  `query MyQuery($user: Identity!) {` +
  (lensFollows
    ? `
    LensMutualFollows: SocialFollowers(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}, blockchain: ALL, limit: 200}
    ) {
      Follower {
        followerAddress {
          socialFollowings(
            input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}}
          ) {
            Following {
              followingAddress {
                addresses
                domains(input: {filter: {isPrimary: {_eq: true}}}) {
                  name
                }
                socials {
                  dappName
                  blockchain
                  profileName
                  profileImage
                  profileTokenId
                  profileTokenAddress
                  userAssociatedAddresses
                }
                xmtp {
                  isXMTPEnabled
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        prevCursor
        nextCursor
      }
    }`
    : '') +
  (farcasterFollows
    ? `FarcasterMutualFollows: SocialFollowers(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}, blockchain: ALL, limit: 200}
    ) {
      Follower {
        followerAddress {
          socialFollowings(
            input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}}
          ) {
            Following {
              followingAddress {
                addresses
                domains(input: {filter: {isPrimary: {_eq: true}}}) {
                  name
                }
                socials {
                  dappName
                  blockchain
                  profileName
                  profileImage
                  profileTokenId
                  profileTokenAddress
                  userAssociatedAddresses
                }
                xmtp {
                  isXMTPEnabled
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        prevCursor
        nextCursor
      }
    }`
    : '') +
  (ethereumTokenTransfers
    ? `EthereumTransfers: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        to {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
          }
          socials {
            dappName
            blockchain
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
            userAssociatedAddresses
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        prevCursor
        nextCursor
      }
    }`
    : '') +
  (polygonTokenTransfers
    ? `PolygonTransfers: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: polygon, limit: 200}
    ) {
      TokenTransfer {
        to {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
          }
          socials {
            dappName
            blockchain
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
            userAssociatedAddresses
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        prevCursor
        nextCursor
      }
    }`
    : '') +
  (poaps
    ? `Poaps(input: {filter: {owner: {_eq: $user}}, blockchain: ALL, limit: 200}) {
      Poap {
        eventId
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        prevCursor
        nextCursor
      }
    }`
    : '') +
  (ethereumNfts
    ? `EthereumNFTs: TokenBalances(
      input: {filter: {tokenType: {_in: [ERC1155, ERC721]}, owner: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenBalance {
        tokenAddress
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        prevCursor
        nextCursor
      }
    }`
    : '') +
  (polygonNfts
    ? `PolygonNFTs: TokenBalances(
      input: {filter: {tokenType: {_in: [ERC1155, ERC721]}, owner: {_eq: $user}}, blockchain: polygon, limit: 200}
    ) {
      TokenBalance {
        tokenAddress
      }
      pageInfo {
        hasNextPage
        hasPrevPage
        prevCursor
        nextCursor
      }
    }`
    : '') +
  `}`;

export function getPoapsAndNftQuery({
  nfts,
  poaps
}: {
  nfts?: boolean;
  poaps?: boolean;
}) {
  return (
    `query MyQuery(` +
    (nfts
      ? `$ethereumNFTs: [Address!], $polygonNFTs: [Address!], $ethNftCursor: String, $polygonNftCursor: String`
      : '') +
    (poaps ? `, $poaps: [String!], $poapCursor: String` : '') +
    `) {` +
    (nfts
      ? `EthereumNFTs: TokenBalances(
  input: {filter: {tokenAddress: {_in: $ethereumNFTs}}, blockchain: ethereum, limit: 200, cursor: $ethNftCursor}
) {
  TokenBalance {
    token {
      name
      address
      tokenNfts{
        tokenId
      }
      blockchain
      logo {
        small
      }
    }
    owner {
      addresses
      domains(input: {filter: {isPrimary: {_eq: true}}}) {
        name
      }
      socials {
        dappName
        profileName
        profileTokenId
        userAssociatedAddresses
      }
      xmtp {
        isXMTPEnabled
      }
    }
  }
  pageInfo {
    hasNextPage
    hasPrevPage
    prevCursor
    nextCursor
  }
}
PolygonNFTs: TokenBalances(
  input: {filter: {tokenAddress: {_in: $polygonNFTs}}, blockchain: polygon, limit: 200, cursor: $polygonNftCursor}
) {
  TokenBalance {
    token {
      name
      address
      tokenNfts{
        tokenId
      }
      blockchain
      logo {
        small
      }
    }
    owner {
      addresses
      domains(input: {filter: {isPrimary: {_eq: true}}}) {
        name
      }
      socials{
        dappName
        profileName
        profileTokenId
        userAssociatedAddresses
      }
      xmtp {
        isXMTPEnabled
      }
    }
  }
  pageInfo {
    hasNextPage
    hasPrevPage
    prevCursor
    nextCursor
  }
}`
      : '') +
    (poaps
      ? `Poaps(input: {filter: {eventId: {_in: $poaps}}, blockchain: ALL, cursor: $poapCursor, limit: 200}) {
  Poap {
    poapEvent {
      eventName
      contentValue {
        image {
          extraSmall
        }
      }
    }
    attendee {
      owner {
        addresses
        domains(input: {filter: {isPrimary: {_eq: true}}}) {
          name
        }
        socials {
          dappName
          profileName
          profileTokenId
          userAssociatedAddresses
        }
        xmtp {
          isXMTPEnabled
        }
      }
    }
  }
  pageInfo {
    hasNextPage
    hasPrevPage
    prevCursor
    nextCursor
  }
}`
      : '') +
    `}`
  );
}
