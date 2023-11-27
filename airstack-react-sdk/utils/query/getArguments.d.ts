import { IntrospectionType, FieldNode, ObjectValueNode } from "graphql";
import { Argument } from "./types";
import { QueryContext } from "../../types";
export declare function getArguments(schemaMap: Record<string, IntrospectionType>, fieldNode: FieldNode, ctx: QueryContext): {
    args: Argument[];
    inputFields: ObjectValueNode["fields"];
};
