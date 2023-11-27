import { IntrospectionType } from "graphql";
export type SchemaMap = Record<string, IntrospectionType>;
export declare function getIntrospectionQueryMap(): Promise<SchemaMap>;
