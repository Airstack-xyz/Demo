export type RecordType = {
  key: string;
  value: string;
};

export type DomainType = {
  isPrimary: boolean;
  avatar: string;
  name: string;
  ownerDetails: {
    identity: string;
    primaryDomain: {
      name: string;
    };
    domains: {
      name: string;
    }[];
  };
  managerDetails: {
    identity: string;
    primaryDomain: {
      name: string;
    };
    domains: {
      name: string;
    }[];
  };
  texts: RecordType[];
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