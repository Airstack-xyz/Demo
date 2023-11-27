export type GetTokenBalancesVariables = {
    identitity: string;
    tokenType: string[];
    blockchain: string;
    limit: number;
};
export declare function useGetTokenBalances(variables: GetTokenBalancesVariables): [(variables?: GetTokenBalancesVariables | undefined) => Promise<{
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
