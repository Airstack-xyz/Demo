import { tokenBlockchains } from '../constants';
import { TokenAddress } from '../page-views/TokenHolders/types';

const getCommonNftOwnersSubQuery = ({
  blockchain,
  tokenAddress1,
  tokenAddress2
}: {
  blockchain: string;
  tokenAddress1: TokenAddress;
  tokenAddress2: TokenAddress;
}) => {
  return `${blockchain}: TokenBalances(
  input: {filter: {tokenAddress: {_eq: "${
    tokenAddress1.address
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
        video {
          original
        }
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
        tokenAddress2.address
      }"}}, blockchain: ${tokenAddress2.blockchain || 'ethereum'}}) {
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
            video {
              original
            }
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
          blockchain
          accounts {
            tokenId
            tokenAddress
          }
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

export function getCommonNftOwnersQuery({
  tokenAddress1,
  tokenAddress2
}: {
  tokenAddress1: TokenAddress;
  tokenAddress2: TokenAddress;
}) {
  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!tokenAddress1.blockchain || tokenAddress1.blockchain === _blockchain) {
      subQueries.push(
        getCommonNftOwnersSubQuery({
          blockchain: _blockchain,
          tokenAddress1,
          tokenAddress2
        })
      );
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query CommonNftOwners($limit: Int) {
    ${subQueriesString}
  }`;
}

const getNftOwnersSubQuery = ({
  blockchain,
  tokenAddress
}: {
  blockchain: string;
  tokenAddress: TokenAddress;
}) => {
  return `${blockchain}: TokenBalances(
  input: {filter: {tokenAddress: {_eq: "${tokenAddress.address}"}}, blockchain: ${blockchain}, limit: $limit}
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
        video {
          original
        }
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
      blockchain
      accounts {
        tokenId
        tokenAddress
      }
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

export function getNftOwnersQuery({
  tokenAddress
}: {
  tokenAddress: TokenAddress;
}) {
  const subQueries: string[] = [];
  tokenBlockchains.forEach(_blockchain => {
    if (!tokenAddress.blockchain || tokenAddress.blockchain === _blockchain) {
      subQueries.push(
        getNftOwnersSubQuery({ blockchain: _blockchain, tokenAddress })
      );
    }
  });
  const subQueriesString = subQueries.join('\n');

  return `query NftOwners($limit: Int) {
    ${subQueriesString}
  }`;
}
