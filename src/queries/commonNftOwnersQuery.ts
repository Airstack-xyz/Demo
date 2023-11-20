import { tokenBlockchains } from '../constants';
import { TokenAddress } from '../pages/TokenHolders/types';

const getCommonNftOwnersSubQuery = (
  blockchain: string,
  token1: TokenAddress,
  token2: TokenAddress
) => {
  return `${blockchain}: TokenBalances(
  input: {filter: {tokenAddress: {_eq: "${
    token1.address
  }"}}, blockchain: ${blockchain}, limit: $limit}
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
      tokenBalances(input: {filter: {tokenAddress: {_eq: "${
        token2.address
      }"}}, blockchain: ${token2.blockchain || 'ethereum'}}) {
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
    }
  }
}`;
};

export function getCommonNftOwnersQuery(
  token1: TokenAddress,
  token2: TokenAddress
) {
  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!token1.blockchain || token1.blockchain === _blockchain) {
      subQueries.push(getCommonNftOwnersSubQuery(_blockchain, token1, token2));
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query CommonNftOwners($limit: Int) {
    ${subQueriesString}
  }`;
}

const getNftOwnersSubQuery = (blockchain: string, token: TokenAddress) => {
  return `${blockchain}: TokenBalances(
  input: {filter: {tokenAddress: {_eq: "${token.address}"}}, blockchain: ${blockchain}, limit: $limit}
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
}`;
};

export function getNftOwnersQuery(token: TokenAddress) {
  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!token.blockchain || token.blockchain === _blockchain) {
      subQueries.push(getNftOwnersSubQuery(_blockchain, token));
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query NftOwners($limit: Int) {
    ${subQueriesString}
  }`;
}
