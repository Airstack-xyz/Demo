export type Domain = {
  isPrimary: boolean;
  avatar: string;
  name: string;
  owner: string;
  manager: string;
  texts: {
    key: string;
    value: string;
  }[];
  multiChainAddresses: {
    symbol: string;
    address: string;
  }[];
  tokenNft: {
    contentValue: {
      image: {
        small: string;
      };
    };
  };
  createdAtBlockTimestamp: string;
  expiryTimestamp: string;
};
