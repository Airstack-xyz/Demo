import React, { ComponentProps } from "react";
import { PresetImageSize } from "../../constants";
import { NFTAssetURL } from "../../types";
type HTMLVideoProps = ComponentProps<"video">;
type HTMLAudioProps = ComponentProps<"audio">;
export type MediaProps = {
    imgProps?: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
    videoProps?: {
        maxDurationForAutoPlay?: number;
    } & HTMLVideoProps;
    audioProps?: HTMLAudioProps;
    preset: PresetImageSize;
    data?: NFTAssetURL["value"];
    onError: () => void;
    onComplete: () => void;
    url: string | null;
};
export declare function Media({ preset, imgProps, videoProps, audioProps, onError, onComplete, url, }: MediaProps): import("react/jsx-runtime").JSX.Element | null;
export {};
