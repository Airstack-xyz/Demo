export const getFaracasterProfile = /* GraphQL */ `
  query GetFaracasterProfile($identity: Identity!) {
    Wallet(input: { identity: $identity, blockchain: ethereum }) {
      farcaster: socials(input: { filter: { dappName: { _eq: farcaster } } }) {
        profileName
        profileHandle
        followerCount
        followingCount
        profileTokenId
      }
    }
  }
`;
