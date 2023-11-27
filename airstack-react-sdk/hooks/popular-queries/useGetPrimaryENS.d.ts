export type GetPrimaryENSVariables = {
    identity: string;
    blockchain: string;
};
export declare function useGetPrimaryENS(variables: GetPrimaryENSVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
