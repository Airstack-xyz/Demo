export type GetENSSubDomainsVariables = {
    owner: string;
    blockchain: string;
};
export declare function useGetENSSubDomains(variables: GetENSSubDomainsVariables): {
    data: any;
    error: any;
    loading: boolean;
    cancelRequest: () => void;
};
