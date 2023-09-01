const fields = `
  amount
  tokenType
  blockchain
  tokenAddress
  formattedAmount
  owner {
      addresses
  }
  tokenNfts {
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

function getSubqueryWithFiter(
  owners: string[],
  index = 0,
  blockchain: string
): string {
  const children =
    owners.length - 1 === index
      ? fields
      : getSubqueryWithFiter(owners, index + 1, blockchain);
  return `
    token {
      tokenBalances(input: {filter: {owner: {_eq: "${owners[index]}"}, tokenType: {_in: $tokenType}}, blockchain: ${blockchain}}) {
        ${children}
      }
    }
  `;
}

const tokenId = `
  tokenNfts: tokenNft {
    tokenId
  }
`;

function getSubqueryForBlockchain({
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
    owners.length === 1 ? fields : getSubqueryWithFiter(owners, 1, blockchain);

  const _filters = [
    `owner:{ _eq: "${owners[0]}" }`,
    `tokenType:{ _in: $tokenType }`
  ];
  if (hasDate) {
    _filters.push('date:{ _eq: $date }');
  }
  if (hasBlockNumber) {
    _filters.push('blockNumber:{ _eq: $blockNumber }');
  }
  if (hasTimestamp) {
    _filters.push('timestamp:{ _eq: $timestamp }');
  }
  const _filtersString = _filters.join(',');

  return `
    ${blockchain}: Snapshots(input:{ filter:{ ${_filtersString} }, blockchain: ${blockchain}, limit: $limit }) {
      TokenBalance: Snapshot {
        ${owners.length > 1 ? tokenId : ''}
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
        ? getSubqueryForBlockchain({
            isEthereum: true,
            ...commonParams
          })
        : ''
    }
    ${
      !blockchain || blockchain === 'polygon'
        ? getSubqueryForBlockchain({
            isEthereum: false,
            ...commonParams
          })
        : ''
    }
  }`;
}
