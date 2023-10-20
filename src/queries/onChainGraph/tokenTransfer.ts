export const tokenTransferQuery = `query TokenTransfer($user: Identity!) {
    EthereumTokenSent: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        to {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
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
    EthereumTokenReceived: TokenTransfers(
      input: {filter: {to: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        from {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
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
    PolygonTokenSent: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        to {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
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
    PolygonTokenReceived: TokenTransfers(
      input: {filter: {to: {_eq: $user}}, blockchain: polygon, limit: 200}
    ) {
      TokenTransfer {
        from {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
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

export const tokenSentQuery = `query TokenSent($user: Identity!) {
    Ethereum: TokenTransfers(
      input: {filter: {from: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: to {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
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
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
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

export const tokenReceivedQuery = `query TokenTransfer($user: Identity!) {
    Ethereum: TokenTransfers(
      input: {filter: {to: {_eq: $user}}, blockchain: ethereum, limit: 200}
    ) {
      TokenTransfer {
        account: from {
          addresses
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
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
          domains(input: {filter: {isPrimary: {_eq: true}}}) {
            name
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
