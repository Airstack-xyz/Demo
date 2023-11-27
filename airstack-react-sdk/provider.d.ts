/// <reference types="react" />
import { Config } from "./config";
type ProviderProps = {
    apiKey: string;
    children: JSX.Element;
} & Omit<Config, "authKey">;
export declare function AirstackProvider({ children, apiKey, ...config }: ProviderProps): JSX.Element;
export {};
