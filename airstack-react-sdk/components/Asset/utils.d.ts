import { PresetImageSize } from "../../constants";
import { NFTAssetURL } from "../../types";
export type MediaType = "image" | "video" | "audio" | "html" | "binary" | "unknown";
export declare function getMediaType(media: string): MediaType;
export declare function getSize(el?: HTMLElement | null): {
    height: number;
    width: number;
};
export declare function getPreset(el?: HTMLElement | null): "extraSmall" | "small" | "medium" | "large" | "original";
export declare function getMediaTypeFromUrl(url: string): Promise<"image" | "video" | "audio" | "binary" | "unknown">;
export declare function getUrlFromData({ data, preset, }: {
    data?: NFTAssetURL["value"] | null;
    preset: PresetImageSize;
}): string | null;
