import { Kind } from "graphql";
export type Argument = {
    path: string[];
    name: string;
    uniqueName?: string;
    valueKind?: Kind;
    assignedVariable?: string;
    type?: string | null;
    ref?: unknown;
    isRequired?: boolean;
    defaultValue: string | any[];
};
