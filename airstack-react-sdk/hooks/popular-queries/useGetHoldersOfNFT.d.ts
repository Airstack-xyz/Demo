export type GetHoldersOfNFTVariables = {
    tokenAddress: string;
    tokenId: string;
    blockchain: string;
};
export declare function useGetHoldersOfNFT(variables: GetHoldersOfNFTVariables): [(variables?: GetHoldersOfNFTVariables | undefined) => Promise<{
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
