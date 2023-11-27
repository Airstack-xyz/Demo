import { ResponseType } from "../types";
export declare function getPaginationData(_response: ResponseType | null): {
    nextCursors: Record<string, string>;
    prevCursors: Record<string, string>;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};
