export type Env = "dev" | "prod";
export type Config = {
    authKey: string;
    env?: Env;
    cache?: boolean;
    cancelHookRequestsOnUnmount?: boolean;
};
export declare const config: Config;
