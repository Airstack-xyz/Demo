export type PageInfo = {
    prevCursor: string;
    nextCursor: string;
};
export type ResponseType = any;
export type QueryContext = {
    variableNamesMap: Record<string, number>;
};
export type FetchQuery<D> = {
    data: D | null;
    error: any;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    getNextPage: () => Promise<FetchQuery<D> | null>;
    getPrevPage: () => Promise<FetchQuery<D> | null>;
};
export type FetchPaginatedQueryReturnType<D> = Promise<FetchQuery<D>>;
export type FetchQueryReturnType<D> = Promise<Pick<FetchQuery<D>, "data" | "error">>;
export type Config = {
    cache?: boolean;
    abortController?: AbortController;
};
export type DataFormatter<D extends ResponseType, P extends (data: D) => any = (data: D) => D> = {
    dataFormatter: P;
};
export type ConfigAndCallbacks<D extends ResponseType, F> = Config & {
    cancelRequestOnUnmount?: boolean;
    onCompleted?: (data: D) => void;
    onError?: (error: any) => void;
    dataFormatter?: F;
};
export type VariablesType = Record<string, any>;
export type NFTAssetURL = {
    type: string;
    value: type["TokenNfts"]["TokenNft"][0]["contentValue"];
};
export type NFTCache = Record<string, NFTAssetURL>;
export interface type {
    TokenNfts: {
        TokenNft: {
            tokenId: string;
            contentType: string;
            contentValue: {
                image?: {
                    extraSmall: string;
                    small: string;
                    medium: string;
                    large: string;
                    original: string;
                };
                video: {
                    original: string;
                };
                audio: {
                    original: string;
                };
                animation_url?: {
                    original: string;
                };
            };
        }[];
    };
}
