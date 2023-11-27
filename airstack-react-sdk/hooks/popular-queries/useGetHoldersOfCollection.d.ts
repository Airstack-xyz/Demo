export type GetHoldersOfCollectionOfTokenCollectionVariables = {
    tokenAddress: string[];
    blockchain: string;
    limit: number;
};
export declare function useGetHoldersOfCollectionOfTokenCollection(variables: GetHoldersOfCollectionOfTokenCollectionVariables): [(variables?: GetHoldersOfCollectionOfTokenCollectionVariables | undefined) => Promise<{
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
