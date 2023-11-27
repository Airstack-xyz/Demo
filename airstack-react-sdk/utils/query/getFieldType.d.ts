import { IntrospectionType, IntrospectionInputObjectType } from "graphql";
export declare function getFieldType(schemaMap: Record<string, IntrospectionType>, fields: IntrospectionInputObjectType["inputFields"], path: string[], index?: number): [string | null, boolean];
