export type GetNFTImagesVariables = {
    address: string;
    tokenId: string;
    blockchain: string;
};
export declare function useGetNFTImages(variables: GetNFTImagesVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
