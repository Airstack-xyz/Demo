const fields = `tokenAddress
tokenId
blockchain
tokenType
formattedAmount
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
tokenNfts {
  contentValue {
    video
    image {
      small
    }
  }
}
owner {
  identity
  addresses
  socials {
    dappSlug
    profileName
  }
  primaryDomain {
    name
  }
  domains {
    dappName
    name
  }
  xmtp {
    isXMTPEnabled
  }
}`;

const fieldsWithAsset = `tokenId
tokenAddress
token {
  logo {
    small
  }
  projectDetails {
    imageUrl
  }
}`;

function getQueryWithFiter(tokens: string[], index = 0): string {
  const children =
    tokens.length - 1 === index ? fields : getQueryWithFiter(tokens, index + 1);
  return `owner {
        tokenBalances(
          input: {filter: {tokenAddress: {_eq: "${tokens[index]}"}}}
        ) {
            ${children}
          }
        }`;
}

export function createCommonOwnersQuery(tokenAddress: string[]) {
  const childern =
    tokenAddress.length === 1 ? fields : getQueryWithFiter(tokenAddress, 1);
  return `query GetTokenHolders($limit: Int) {
    ethereum: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${
        tokenAddress[0]
      }"}}, blockchain: ethereum, limit: $limit}
    ) {
      TokenBalance {
        ${tokenAddress.length > 1 ? fieldsWithAsset : ''} 
        ${childern}
      }
    }
    polygon: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${
        tokenAddress[0]
      }"}}, blockchain: polygon, limit: $limit}
    ) {
      TokenBalance {
        ${tokenAddress.length > 1 ? fieldsWithAsset : ''}
        ${childern}
      }
    }
  }`;
}
