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
  const subQueriesString = ['ethereum', 'polygon', 'base']
    .map(blockchain => getCommonNftOwnersSubQuery(blockchain, token1, token2))
    .join('\n');

  return `query CommonNftOwners($limit: Int) {
    ${subQueriesString}
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
  const subQueriesString = ['ethereum', 'polygon', 'base']
    .map(blockchain => getNftOwnersSubQuery(blockchain, token))
    .join('\n');

  return `query NftOwners($limit: Int) {
    ${subQueriesString}
  }`;
}
