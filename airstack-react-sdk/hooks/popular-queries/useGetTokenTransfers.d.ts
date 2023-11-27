export type GetTokenTransfersVariables = {
    address: string;
    blockchain: string;
};
export declare function useGetTokenTransfers(variables: GetTokenTransfersVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
