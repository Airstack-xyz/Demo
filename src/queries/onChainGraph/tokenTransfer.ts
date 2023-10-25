export const tokenSentQuery = `query TokenSent($user: Identity!) {
    Ethereum: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: to {
          addresses
          primaryDomain {
            name
          }
          domains {
            name
            isPrimary
          }
          socials {
            dappName
            blockchain
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
    Polygon: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: to {
          addresses
          primaryDomain {
            name
          }
          domains {
            name
            isPrimary
          }
          socials {
            dappName
            blockchain
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
  }`;

export const tokenReceivedQuery = `query TokenReceived($user: Identity!) {
    Ethereum: TokenTransfers(
      input: {filter: {to: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: from {
          addresses
          primaryDomain {
            name
          }
          domains {
            name
            isPrimary
          }
          socials {
            dappName
            blockchain
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
    Polygon: TokenTransfers(
      input: {filter: {to: {_eq: $user}}, blockchain: polygon, limit: 200}
    ) {
      TokenTransfer {
        account: from {
          addresses
          primaryDomain {
            name
          }
          domains {
            name
            isPrimary
          }
          socials {
            dappName
            blockchain
            profileName
            profileImage
            profileTokenId
            profileTokenAddress
          }
          xmtp {
            isXMTPEnabled
          }
        }
      }
    }
  }`;
