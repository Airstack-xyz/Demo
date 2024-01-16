const socialInput = '(input: {filter: {dappName: {_in: $socialFilters}}})';
const primaryDomainInput =
  '(input: {filter: {isPrimary: {_eq: $hasPrimaryDomain}}})';

export const getWalletDetailsQuery = ({
  hasSocialFilters,
  hasPrimaryDomain
}: {
  hasSocialFilters?: boolean;
  hasPrimaryDomain?: boolean;
} = {}) => {
  return `query WalletDetails($address: Identity!) {
    Wallet(input: {identity: $address, blockchain: ethereum}) {
      identity
      addresses
      socials${hasSocialFilters ? socialInput : ''} {
        blockchain
        dappName
        profileName
        profileHandle
      }
      primaryDomain {
        name
      }
      domains${hasPrimaryDomain ? primaryDomainInput : ''} {
        name
      }
      xmtp {
        isXMTPEnabled
      }
    }
  }`;
};
