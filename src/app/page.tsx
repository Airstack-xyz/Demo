"use client";
import React from "react";
import { resetCachedUserInputs } from "../hooks/useSearchInput";
import { TokenBalance } from "../pages/TokenBalances";
import { apiKey } from "@/constants";
import { init } from "@airstack/airstack-react";

init(apiKey, {
  cancelHookRequestsOnUnmount: true,
});

export default function Home() {
  resetCachedUserInputs();

  return <TokenBalance />;
}
