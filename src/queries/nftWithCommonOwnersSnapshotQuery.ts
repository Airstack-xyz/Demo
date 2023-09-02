const recursiveFields = `
  amount
  tokenType
  blockchain
  tokenAddress
  formattedAmount
  owner {
    addresses
  }
  tokenNfts: tokenNft {
    tokenId
    contentValue {
      image {
        small
        large
        extraSmall
        medium
        original
      }
    }
  }
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
`;

function getSubQueryWithFilter(
  owners: string[],
  index = 0,
  blockchain: string
): string {
  const children =
    owners.length - 1 === index
      ? recursiveFields
      : getSubQueryWithFilter(owners, index + 1, blockchain);
  return `
    token {
      name
      symbol
      logo {
        small
      }
      projectDetails {
        imageUrl
      }
      tokenBalances(input: {filter: {owner: {_eq: "${owners[index]}"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}}) {
        ${children}
      }
    }
  `;
}

const fields = `
  blockchain
  tokenAddress
  tokenType
  tokenNfts: tokenNft {
    tokenId
    contentValue {
      image {
        medium
      }
    }
  }
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
`;

function getSubQueryForBlockchain({
  owners,
  isEthereum,
  hasDate,
  hasBlockNumber,
  hasTimestamp
}: {
  owners: string[];
  isEthereum?: boolean;
  hasDate?: boolean;
  hasBlockNumber?: boolean;
  hasTimestamp?: boolean;
}) {
  const blockchain = isEthereum ? 'ethereum' : 'polygon';
  const children =
    owners.length === 1
      ? recursiveFields
      : getSubQueryWithFilter(owners, 1, blockchain);

  const _filters = [
    `owner: {_eq: "${owners[0]}"}`,
    `tokenType: {_in: $tokenType}`
  ];
  if (hasDate) {
    _filters.push('date: {_eq: $date}');
  }
  if (hasBlockNumber) {
    _filters.push('blockNumber: {_eq: $blockNumber}');
  }
  if (hasTimestamp) {
    _filters.push('timestamp: {_eq: $timestamp}');
  }
  const _filtersString = _filters.join(',');

  return `
    ${blockchain}: Snapshots(input: {filter: {${_filtersString}}, blockchain: ${blockchain}, limit: $limit}) {
      TokenBalance: Snapshot {
        ${owners.length > 1 ? fields : ''}
        ${children}
      }
    }
  `;
}

export function createNftWithCommonOwnersSnapshotQuery({
  owners,
  blockchain,
  date,
  blockNumber,
  timestamp
}: {
  owners: string[];
  blockchain: string | null;
  date?: string;
  blockNumber?: number;
  timestamp?: number;
}) {
  if (!owners.length) return '';

  const commonParams = {
    owners,
    hasDate: !!date,
    hasBlockNumber: !!blockNumber,
    hasTimestamp: !!timestamp
  };

  const _variables = ['$tokenType: [TokenType!]', '$limit: Int'];
  if (commonParams.hasDate) {
    _variables.push('$date: String!');
  }
  if (commonParams.hasBlockNumber) {
    _variables.push('$blockNumber: Int!');
  }
  if (commonParams.hasTimestamp) {
    _variables.push('$timestamp: Int!');
  }
  const _variablesString = _variables.join(',');

  return `query GetTokens(${_variablesString}) {
    ${
      !blockchain || blockchain === 'ethereum'
        ? getSubQueryForBlockchain({
            isEthereum: true,
            ...commonParams
          })
        : ''
    }
    ${
      !blockchain || blockchain === 'polygon'
        ? getSubQueryForBlockchain({
            isEthereum: false,
            ...commonParams
          })
        : ''
    }
  }`;
}
