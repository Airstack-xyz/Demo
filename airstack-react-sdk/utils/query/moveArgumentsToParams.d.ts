import { DocumentNode } from "graphql";
import { Argument } from "./types";
export declare function moveArgumentsToParams(query: DocumentNode, args: Argument[]): DocumentNode;
