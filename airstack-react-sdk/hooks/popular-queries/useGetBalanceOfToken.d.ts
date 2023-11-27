export type GetBalanceOfTokenVariables = {
    blockchain: string;
    tokenAddress: string;
    owner: string;
};
export declare function useGetBalanceOfToken(variables: GetBalanceOfTokenVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
