"use client";
import React from "react";
import { resetCachedUserInputs } from "../../hooks/useSearchInput";
import { TokenBalance } from "../../pages/TokenBalances";
import { init } from "@airstack/airstack-react";
import { apiKey } from "@/constants";

init(apiKey, {
  cancelHookRequestsOnUnmount: true,
});

export default function Home() {
  resetCachedUserInputs();
  console.log("API_KEY: ", process.env.API_KEY);
  return <TokenBalance />;
}
