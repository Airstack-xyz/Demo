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
  const variables = ['$address: Identity!', '$blockchain: TokenBlockchain!'];
  if (hasSocialFilters) {
    variables.push('$socialFilters: [SocialDappName!]');
  }
  if (hasPrimaryDomain) {
    variables.push('$hasPrimaryDomain: Boolean');
  }
  const variablesString = variables.join(',');

  return `query WalletDetails(${variablesString}) {
    Wallet(input: {identity: $address, blockchain: $blockchain}) {
      identity
      addresses
      blockchain
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
