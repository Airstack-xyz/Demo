import { ResponseType } from "../types";
export declare function getQueriesWithLastPage(data: ResponseType): Record<string, {
    nextCursor: string;
    prevCursor: string;
}>;
