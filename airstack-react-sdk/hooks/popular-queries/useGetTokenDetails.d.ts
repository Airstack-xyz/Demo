export type GetTokenDetailsVariables = {
    address: string;
    blockchain: string;
};
export declare function useGetTokenDetails(variables: GetTokenDetailsVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
