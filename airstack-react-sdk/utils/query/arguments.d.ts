import { ObjectFieldNode } from "graphql";
import { Argument } from "./types";
import { QueryContext } from "../../types";
export declare function getArgumentsFromInput(inputs: readonly ObjectFieldNode[], ctx: QueryContext, _key?: string): Argument[];
export declare function createArgumentValue(value: unknown): {
    kind: string;
    name: {
        kind: string;
        value: unknown;
    };
};
