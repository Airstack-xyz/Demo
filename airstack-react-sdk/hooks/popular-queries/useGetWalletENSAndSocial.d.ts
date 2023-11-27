export type GetWalletENSAndSocialVariables = {
    identity: string;
    blockchain: string;
};
export declare function useGetWalletENSAndSocial(variables: GetWalletENSAndSocialVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
