export const walletDetailsQuery = `query WalletDetails($address: Identity!, $blockchain: TokenBlockchain!) {
  Wallet(input: {identity: $address, blockchain: $blockchain}) {
    identity
    addresses
    blockchain
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
}`;
