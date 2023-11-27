import { Argument } from "./types";
export declare function createVariable({ type, isRequired, name, uniqueName, valueKind, }: Argument): {
    kind: string;
    variable: {
        kind: string;
        name: {
            kind: string;
            value: string;
        };
    };
    type: any;
    directives: never[];
};
