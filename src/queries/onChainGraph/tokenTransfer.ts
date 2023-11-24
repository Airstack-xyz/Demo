import { tokenBlockchains } from '../../constants';
import { QUERY_LIMIT } from '../../pages/OnchainGraph/constants';
import { capitalizeFirstLetter } from '../../utils';

const getTokenSentSubQuery = (blockchain: string) => {
  return `
  ${capitalizeFirstLetter(blockchain)}: TokenTransfers(
    input: {filter: {from: {_eq: $user}}, blockchain: ${blockchain}, limit: ${QUERY_LIMIT}}
  ) {
    TokenTransfer {
      account: to {
        addresses
        primaryDomain {
          name
          tokenNft {
            tokenId
            address
            blockchain
          }
        }
        domains {
          name
          isPrimary
          tokenNft {
            tokenId
            address
            blockchain
          }
        }
        socials {
          dappName
          blockchain
          profileName
          profileHandle
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
  `;
};

export const tokenSentQuery = `query TokenSent($user: Identity!) {
  ${tokenBlockchains
    .map(blockchain => getTokenSentSubQuery(blockchain))
    .join('\n')}
}`;

const getTokenReceivedSubQuery = (blockchain: string) => {
  return `${capitalizeFirstLetter(blockchain)}: TokenTransfers(
    input: {filter: {to: {_eq: $user}}, blockchain: ${blockchain}, limit: ${QUERY_LIMIT}}
  ) {
    TokenTransfer {
      account: from {
        addresses
        primaryDomain {
          name
          tokenNft {
            tokenId
            address
            blockchain
          }
        }
        domains {
          name
          isPrimary
          tokenNft {
            tokenId
            address
            blockchain
          }
        }
        socials {
          dappName
          blockchain
          profileName
          profileHandle
          profileImage
          profileTokenId
          profileTokenAddress
        }
        xmtp {
          isXMTPEnabled
        }
      }
    }
  }`;
};

export const tokenReceivedQuery = `query TokenReceived($user: Identity!) {
  ${tokenBlockchains
    .map(blockchain => getTokenReceivedSubQuery(blockchain))
    .join('\n')}
}`;
