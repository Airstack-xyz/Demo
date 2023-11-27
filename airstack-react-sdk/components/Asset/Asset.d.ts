import React from "react";
import { Chain, PresetImageSize } from "../../constants";
import { MediaProps } from "./Media";
export type AssetProps = {
    chain?: Chain;
    address: string;
    tokenId: string;
    loading?: React.ReactNode;
    error?: React.ReactNode;
    progressCallback?: (status: Status) => void;
    preset?: PresetImageSize;
    containerClassName?: string;
} & Omit<MediaProps, "data" | "onError" | "preset" | "onComplete" | "url">;
declare enum Status {
    Loading = "loading",
    Loaded = "loaded",
    Error = "error"
}
export declare const AssetContent: (props: AssetProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
