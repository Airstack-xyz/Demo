import { TokenAddress } from '../pages/TokenHolders/types';

const getCommonNftOwnersSubQuery = (
  blockchain: string,
  token1: TokenAddress,
  token2: TokenAddress
) => {
  return `${blockchain}: TokenBalances(
  input: {filter: {tokenAddress: {_eq: "${token1.address}"}}, blockchain: ${blockchain}, limit: $limit}
) {
  TokenBalance {
    tokenId
    tokenAddress
    tokenType
    formattedAmount
    blockchain
    token {
      logo {
        small
      }
      projectDetails {
        imageUrl
      }
    }
    tokenNfts {
      contentValue {
        video
        image {
          small
          medium
        }
      }
      erc6551Accounts {
        address {
          identity
        }
      }
    }
    owner {
      tokenBalances(input: {filter: {tokenAddress: {_eq: "${token2.address}"}}, blockchain: ${token2.blockchain}}) {
        tokenId
        tokenAddress
        tokenType
        formattedAmount
        blockchain
        token {
          logo {
            small
          }
          projectDetails {
            imageUrl
          }
        }
        tokenNfts {
          contentValue {
            video
            image {
              small
              medium
            }
          }
          erc6551Accounts {
            address {
              identity
            }
          }
        }
        owner {
          identity
          addresses
          socials {
            blockchain
            dappSlug
            profileName
          }
          primaryDomain {
            name
          }
          domains {
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
}`;
};

export function getCommonNftOwnersQuery(
  token1: TokenAddress,
  token2: TokenAddress
) {
  return `query CommonNftOwners($limit: Int) {
    ${getCommonNftOwnersSubQuery('ethereum', token1, token2)}
    ${getCommonNftOwnersSubQuery('polygon', token1, token2)}
    ${getCommonNftOwnersSubQuery('base', token1, token2)}
  }`;
}

const getNftOwnersSubQuery = (blockchain: string, token: string) => {
  return `${blockchain}: TokenBalances(
  input: {filter: {tokenAddress: {_eq: "${token}"}}, blockchain: ${blockchain}, limit: $limit}
) {
  TokenBalance {
    tokenId
    tokenAddress
    tokenType
    formattedAmount
    blockchain
    token {
      logo {
        small
      }
      projectDetails {
        imageUrl
      }
    }
    tokenNfts {
      contentValue {
        video
        image {
          small
          medium
        }
      }
      erc6551Accounts {
        address {
          identity
        }
      }
    }
    owner {
      identity
      addresses
      socials {
        blockchain
        dappSlug
        profileName
      }
      primaryDomain {
        name
      }
      domains {
        chainId
        dappName
        name
      }
      xmtp {
        isXMTPEnabled
      }
    }
  }
}`;
};

export function getNftOwnersQuery(token: string) {
  return `query NftOwners($limit: Int) {
    ${getNftOwnersSubQuery('ethereum', token)}
    ${getNftOwnersSubQuery('polygon', token)}
    ${getNftOwnersSubQuery('base', token)}
  }`;
}
