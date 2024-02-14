export const domainDetailsQuery = `query DomainDetails($name: String!) {
  Domain(input: {name: $name, blockchain: ethereum}) {
    isPrimary
    avatar
    name
    ownerDetails {
      identity
      primaryDomain {
        name
      }
      domains(input: {filter: {isPrimary: {_eq: false}}}) {
        name
      }
    }
    managerDetails {
      identity
      primaryDomain {
        name
      }
      domains(input: {filter: {isPrimary: {_eq: false}}}) {
        name
      }
    }
    texts {
      key
      value
    }
    multiChainAddresses {
      symbol
      address
    }
    tokenNft {
      contentValue {
        image {
          small
        }
      }
    }
    createdAtBlockTimestamp
    expiryTimestamp
  }
}`;
