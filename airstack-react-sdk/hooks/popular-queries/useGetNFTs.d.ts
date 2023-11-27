export type GetNFTsVariables = {
    blockchain: string;
    limit: number;
    address: string;
};
export declare function useGetNFTs(variables: GetNFTsVariables): [(variables?: GetNFTsVariables | undefined) => Promise<{
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
