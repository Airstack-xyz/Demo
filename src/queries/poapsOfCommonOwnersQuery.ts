const fields = `id
blockchain
tokenId
tokenAddress
poapEvent {
  city
  eventName
  startDate
  eventId
  logo: contentValue {
    image {
      small
      medium
    }
  }
}`;

const parentFields = `id
blockchain
tokenId
tokenAddress
poapEvent {
  city
  eventName
  startDate
  eventId
  logo: contentValue {
    image {
      small
      medium
    }
  }
}`;

function getQueryWithFilter(owners: string[], index = 0): string {
  const children =
    owners.length - 1 === index
      ? fields
      : getQueryWithFilter(owners, index + 1);
  return `poapEvent {
        city
        eventName
        startDate
        eventId
        logo: contentValue {
          image {
            small
            medium
          }
        }
        poaps(
          input: {filter: {owner: {_eq: "${owners[index]}"}}}
        ) {
            ${children}
          }
        }`;
}

export function poapsOfCommonOwnersQuery(owners: string[]) {
  const children = owners.length === 1 ? fields : getQueryWithFilter(owners, 1);
  return `query GetPOAPs($limit: Int $sortBy: OrderBy) {
    Poaps(
      input: {filter: {owner: {_eq: "${
        owners[0]
      }"}}, blockchain: ALL, limit: $limit, order:{createdAtBlockNumber: $sortBy}}
    ) {
      Poap {
        ${owners.length > 1 ? parentFields : ''}
        ${children}
      }
    } 
  }`;
}
