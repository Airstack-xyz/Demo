const getFollowingBaseQuery = (forLens = false) => `Following {
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
    }
    xmtp {
      isXMTPEnabled
    }
    mutualFollower: socialFollowers(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: ${
        forLens ? 'lens' : 'farcaster'
      }}}}
    ) {
      Follower {
        followerAddress{
          socials {
            profileName
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
}`;

export const getOnChainGraphQuery = ({
  ethereumNfts = true,
  polygonNfts = true,
  poaps = true,
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
    LensFollowings: SocialFollowings(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: lens}}, blockchain: ALL, limit: 200}
    ) {
      ${getFollowingBaseQuery(true)}
    }`
    : '') +
  (farcasterFollows
    ? `FarcasterFollowings: SocialFollowings(
      input: {filter: {identity: {_eq: $user}, dappName: {_eq: farcaster}}, blockchain: ALL, limit: 200}
    ) {
      ${getFollowingBaseQuery()}
    }`
    : '') +
  (poaps
    ? `Poaps(input: {filter: {owner: {_eq: $user}}, blockchain: ALL, limit: 200}) {
      Poap {
        eventId
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
      
    }`
    : '') +
  (polygonNfts
    ? `PolygonNFTs: TokenBalances(
      input: {filter: {tokenType: {_in: [ERC1155, ERC721]}, owner: {_eq: $user}}, blockchain: polygon, limit: 200}
    ) {
      TokenBalance {
        tokenAddress
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
      }
      xmtp {
        isXMTPEnabled
      }
    }
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
      }
      xmtp {
        isXMTPEnabled
      }
    }
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
        }
        xmtp {
          isXMTPEnabled
        }
      }
    }
  }
}`
      : '') +
    `}`
  );
}
