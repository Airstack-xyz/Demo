export type GetWalletENSVariables = {
    identity: string;
    blockchain: string;
};
export declare function useGetWalletENS(variables: GetWalletENSVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
