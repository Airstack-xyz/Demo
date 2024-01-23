import { tokenBlockchains } from '../constants';

export const SocialQuery = `query GetSocial($identity: Identity!) {
  Wallet(input: {identity: $identity, blockchain: ethereum}) {
    addresses
    primaryDomain {
      name
    }
    domains {
      isPrimary
      name
      tokenNft {
        tokenId
        address
        blockchain
      }
    }
    farcasterSocials: socials(input: {filter: {dappName: {_eq: farcaster}}}) {
      isDefault
      blockchain
      profileName
      profileHandle
      profileImage
      followerCount
      followingCount
      profileTokenId
      profileTokenAddress
      profileImageContentValue {
        image {
          small
        }
      }
    }
    lensSocials: socials(input: {filter: {dappName: {_eq: lens}}}) {
      isDefault
      blockchain
      profileName
      profileHandle
      profileImage
      followerCount
      followingCount
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
}`;

export const SocialOverlapQuery = `query GetSocialOverlap($identity1: Identity!, $identity2: Identity!) {
  wallet1: Wallet(input: {identity: $identity1, blockchain: ethereum}) {
    addresses
    primaryDomain {
      name
    }
    domains {
      name
    }
    farcasterSocials: socials(input: {filter: {dappName: {_eq: farcaster}}}) {
      isDefault
      blockchain
      profileName
      profileHandle
      profileTokenId
      followerCount
      followingCount
    }
    lensSocials: socials(input: {filter: {dappName: {_eq: lens}}}) {
      isDefault
      blockchain
      profileName
      profileHandle
      profileTokenId
      followerCount
      followingCount
    }
    xmtp {
      isXMTPEnabled
    }
  }
  wallet2: Wallet(input: {identity: $identity2, blockchain: ethereum}) {
    addresses
    primaryDomain {
      name
    }
    domains {
      name
    }
    farcasterSocials: socials(input: {filter: {dappName: {_eq: farcaster}}}) {
      isDefault
      blockchain
      profileName
      profileHandle
      profileTokenId
      followerCount
      followingCount
    }
    lensSocials: socials(input: {filter: {dappName: {_eq: lens}}}) {
      isDefault
      blockchain
      profileName
      profileHandle
      profileTokenId
      followerCount
      followingCount
    }
    xmtp {
      isXMTPEnabled
    }
  }
}`;

export const SearchAIMentionsQuery = `
  query SearchAIMentions($input: SearchAIMentionsInput!) {
    SearchAIMentions(input: $input) {
      results {
        type
        name
        address
        eventId
        blockchain
        image {
          extraSmall
        }
        metadata {
          tokenMints
        }
      }
    }
  }
`;

export const AdvancedMentionSearchQuery = `
  query GetAIMentions($input: SearchAIMentionsInput!) {
    SearchAIMentions(input: $input) {
      results {
        type
        name
        address
        eventId
        blockchain
        tokenType
        blockchain
        symbol
        image {
          extraSmall
          medium
        }
        metadata {
          tokenMints
        }
      }
      pageInfo {
        nextCursor
      }
    }
  }
`;

export const SocialSearchQuery = `query GetSocials($searchRegex: [String!], $limit: Int) {
  Socials(
    input: {filter: {profileName: {_regex_in: $searchRegex}}, blockchain: ethereum, order: {followerCount: DESC}, limit: $limit}
  ) {
    Social {
      id
      profileName
      dappName
      followerCount
    }
  }
}`;

const getTokenOwnerSubQuery = (blockchain: string) => {
  return `${blockchain}: TokenBalances(
    input: {filter: {tokenAddress: {_eq: $tokenAddress}}, blockchain: ${blockchain}, limit: $limit}
  ) {
    TokenBalance {
      tokenAddress
      tokenId
      blockchain
      tokenType
      formattedAmount
      token {
        name
        symbol
        logo {
          medium
          small
        }
        projectDetails {
          imageUrl
        }
      }
      tokenNfts {
        contentValue {
          video {
            original
          }
          image {
            small
            medium
          }
        }
      }
      owner {
        identity
        addresses
        socials {
          blockchain
          dappName
          profileName
          profileHandle
        }
        primaryDomain {
          name
        }
        domains {
          name
        }
        xmtp {
          isXMTPEnabled
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }`;
};

export const TokenOwnerQuery = `query GetTokenHolders($tokenAddress: Address, $limit: Int) {
  ${tokenBlockchains
    .map(blockchain => getTokenOwnerSubQuery(blockchain))
    .join('\n')}
}`;

export const PoapOwnerQuery = `query GetPoapHolders($eventId: [String!], $limit: Int) {
  Poaps(input: {filter: {eventId: {_in: $eventId}}, blockchain: ALL, limit: $limit}) {
    Poap {
      id
      blockchain
      tokenId
      tokenAddress
      eventId
      poapEvent {
        contentValue {
          image {
            original
            medium
            large
            extraSmall
            small
          }
          video {
            original
          }
          audio {
            original
          }
        }
        logo: contentValue {
          image {
            small
            medium
          }
        }
        blockchain
        eventName
        endDate
        city
      }
      owner {
        identity
        addresses
        socials {
          blockchain
          dappName
          profileName
          profileHandle
        }
        primaryDomain {
          name
        }
        domains {
          name
        }
        xmtp {
          isXMTPEnabled
        }
      }
    }
    pageInfo {
      nextCursor
      prevCursor
    }
  }
}`;

export const DomainsQuery = `query GetDomains($addresses: [Address!] $limit:Int) {
  Domains(input: {filter: {resolvedAddress: {_in: $addresses}}, blockchain: ethereum, limit:$limit}) {
    Domain {
      id
      name
    }
  }
}`;

export const SocialsQuery = `query GetSocials($addresses: [Identity!], $dappName: SocialDappName!, $limit: Int) {
  Socials(
    input: {filter: {identity: {_in: $addresses}, dappName: {_eq: $dappName}}, blockchain: ethereum, limit: $limit}
  ) {
    Social {
      id
      profileName
    }
  }
}`;

export const UrlShortenMutation = `mutation ShortenUrl($longUrl: String!) {
  ShortenUrl(url: $longUrl) {
    actualUrl
    shortenedUrl
  }
}`;
