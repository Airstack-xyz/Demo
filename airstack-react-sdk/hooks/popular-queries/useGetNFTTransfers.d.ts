export type GetNFTTransfersVariables = {
    tokenAddress: string;
    tokenId: string;
    blockchain: string;
    limit: number;
};
export declare function useGetNFTTransfers(variables: GetNFTTransfersVariables): [(variables?: GetNFTTransfersVariables | undefined) => Promise<{
    data: any;
    error: any;
} & {
    pagination: Omit<{
        hasNextPage: boolean;
        hasPrevPage: boolean;
        getNextPage: () => Promise<void>;
        getPrevPage: () => Promise<void>;
    }, "getNextPage" | "getPrevPage">;
}>, {
    data: any;
    error: any;
} & {
    loading: boolean;
    pagination: {
        hasNextPage: boolean;
        hasPrevPage: boolean;
        getNextPage: () => Promise<void>;
        getPrevPage: () => Promise<void>;
    };
    cancelRequest: () => void;
}];
