export const apiKey = "190fc193f24b34d7cafc3dec305c96b0a";

// Used for options in Blockchain filter
// Used in queries for generating sub-queries throughout the app
export const tokenBlockchains = [
  "ethereum",
  "base",
  "polygon",
  "zora",
] as const;

// Used in queries for generating sub-queries for snapshots
export const snapshotBlockchains = ["ethereum", "base", "zora"] as const;

// Used for options in Blockchain filter in @mentions for Advanced Search
export const mentionBlockchains = [
  "ethereum",
  "base",
  "polygon",
  "zora",
  "gnosis",
] as const;

export const downCSVKeys = [
  "nft-holders",
  "erc20-holders",
  "poap-holders",
  "nft-holders-snapshot",
  "erc20-holders-snapshot",
  "common-nft-holders",
  "nft-erc20-holders",
  "erc20-poap-holders",
  "nft-balances",
  "erc20-balances",
  "poap-balances",
  "nft-balances-snapshot",
  "erc20-balances-snapshot",
  "socials",
  "farcaster-followers",
  "farcaster-erc20-followers",
  "farcaster-poap-followers",
  "farcaster-nft-followers",
  "farcaster-followings",
  "farcaster-erc20-followings",
  "farcaster-poap-followings",
  "farcaster-nft-followings",
  "lens-followers",
  "lens-erc20-followers",
  "lens-poap-followers",
  "lens-nft-followers",
  "lens-followings",
  "lens-erc20-followings",
  "lens-poap-followings",
  "lens-nft-followings",
] as const;

export const ROUTES = {
  logout: "/logout",
  home: "/",
  explorer: "/api-studio",
  myQueries: "/my-queries",
  publicQuery: "/query",
  apps: "/apps",
  sdks: "/sdks",
  profilesSettings: "/profile-settings",
  pricing: "/pricing",
  paymentSuccess: "/payment-success",
};

export const APP_BASE_URL =
  process.env.APP_BASE_URL || "http://app.uat.airstack.xyz";

export const historyPage =
  APP_BASE_URL + ROUTES.profilesSettings + "/usage-details?activeKey=csv";

export default ROUTES;
