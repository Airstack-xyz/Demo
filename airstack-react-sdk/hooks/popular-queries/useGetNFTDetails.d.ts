export type GetNFTDetailsVariables = {
    address: string;
    tokenId: string;
    blockchain: string;
};
export declare function useGetNFTDetails(variables: GetNFTDetailsVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
