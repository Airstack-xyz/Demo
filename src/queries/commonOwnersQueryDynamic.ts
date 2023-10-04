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

const poapFields = `id
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
    video
    audio
  }
  logo: contentValue {
    image {
      small
      medium
    }
  }
  blockchain
  eventName
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

function getFields(tokenAddress: string) {
  const isToken = tokenAddress.startsWith('0x');
  return isToken ? fields : poapFields;
}

function getQueryWithFilter(tokens: string[], index = 0): string {
  const isToken = tokens[index].startsWith('0x');
  const children =
    tokens.length - 1 === index
      ? getFields(tokens[index])
      : getQueryWithFilter(tokens, index + 1);
  return `owner {
        ${isToken ? 'tokenBalances' : 'poaps'}(
          input: {filter: {${isToken ? 'tokenAddress' : 'eventId'}: {_eq: "${
    tokens[index]
  }"}}}
        ) {
            ${children}
          }
        }`;
}

function sortArray(array: string[]) {
  const startsWith0x: string[] = [];
  const notStartsWith0x: string[] = [];

  for (const item of array) {
    if (item.startsWith('0x')) {
      startsWith0x.push(item);
    } else {
      notStartsWith0x.push(item);
    }
  }

  return [...startsWith0x, ...notStartsWith0x];
}

export function commonOwnersQueryDynamic(tokenAddress: string[]) {
  if (!tokenAddress || tokenAddress.length === 0) return '';
  // make sure the tokenAddress had tokens alwasy first
  tokenAddress = sortArray(tokenAddress);
  const isToken = tokenAddress[0].startsWith('0x');
  const children =
    tokenAddress.length === 1
      ? getFields(tokenAddress[0])
      : getQueryWithFilter(tokenAddress, 1);

  return `query GetTokenAndPoapsHolders($limit: Int) {
    ethereum: ${isToken ? 'TokenBalances' : 'Poaps'}(
      input: {filter: {${isToken ? 'tokenAddress' : 'eventId'}: {_eq: "${
    tokenAddress[0]
  }"}}, blockchain: ethereum, limit: $limit}
    ) {
      TokenBalance {
        ${tokenAddress.length > 1 ? fieldsWithAsset : ''} 
        ${children}
      }
    }
    ${
      isToken
        ? `polygon: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "${
        tokenAddress[0]
      }"}}, blockchain: polygon, limit: $limit}
    ) {
      TokenBalance {
        ${tokenAddress.length > 1 ? fieldsWithAsset : ''}
        ${children}
      }
    }`
        : ''
    }
  }`;
}
