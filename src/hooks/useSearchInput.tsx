import { useCallback, useMemo } from "react";
import { TabUrl } from "../Components/Search/SearchTabSection";
import { createSearchParams } from "react-router-dom";
import useSearchParams from "@/hooks/useSearchParams";
import { useNavigate } from "@/hooks/useNavigate";
import { usePathname } from "next/navigation";

export type CachedQuery = {
  address: string[];
  tokenType: string;
  rawInput: string;
  inputType: "POAP" | "ADDRESS" | null;
  tokenFilters: string[];
  activeView: string;
  activeViewToken: string;
  activeViewCount: string;
  blockchainType: string[];
  sortOrder: string;
  spamFilter: string;
  mintFilter: string;
  resolve6551: string;
  activeTokenInfo: string;
  activeSnapshotInfo: string;
  activeSocialInfo: string;
  activeENSInfo: string;
};

export type UserInputs = CachedQuery;

export const userInputCache = {
  tokenBalance: {} as UserInputs,
  tokenHolder: {} as UserInputs,
  channels: {} as UserInputs,
};

const urlToPathMap: Record<TabUrl, keyof typeof userInputCache> = {
  "token-balances": "tokenBalance",
  "token-holders": "tokenHolder",
  channels: "channels",
};

export type UpdateUserInputs = (
  data: Partial<UserInputs>,
  config?: {
    reset?: boolean;
    updateQueryParams?: boolean;
    redirectTo?: string;
    replace?: boolean;
  }
) => void;

const arrayTypes = ["address", "blockchainType", "tokenFilters"];

export function resetCachedUserInputs(
  clear: "all" | "tokenBalance" | "tokenHolder" = "all"
) {
  if (clear === "all" || clear === "tokenBalance") {
    userInputCache.tokenBalance = {} as UserInputs;
  }
  if (clear === "all" || clear === "tokenHolder") {
    userInputCache.tokenHolder = {} as UserInputs;
  }
}

export function useSearchInput(
  activeStoreName?: TabUrl | null
): [UserInputs, UpdateUserInputs, ReturnType<typeof useSearchParams>[1]] {
  const navigate = useNavigate();
  const activePath = usePathname()?.replace("/", "") as TabUrl;
  const activeStore =
    urlToPathMap[activeStoreName || activePath] || "tokenBalance";
  const isTokenBalances = activeStoreName === "token-balances";

  const [searchParams, setSearchParams] = useSearchParams();

  const setData: UpdateUserInputs = useCallback(
    (data: Partial<CachedQuery>, config) => {
      let inputs = data;
      const shouldReplaceFilters =
        config?.replace ||
        (data?.tokenFilters &&
          userInputCache.tokenHolder?.tokenFilters?.length > 0);

      if (activeStore in userInputCache) {
        inputs = {
          ...(config?.reset ? {} : userInputCache[activeStore]),
          ...data,
        };
        userInputCache[activeStore] = inputs as UserInputs;
      }

      if (config?.updateQueryParams) {
        const searchParamsInput = { ...inputs };
        for (const key in inputs) {
          if (!searchParamsInput[key as keyof typeof searchParamsInput]) {
            // eslint-disable-next-line
            // @ts-ignore
            searchParamsInput[key] = "";
          } else if (arrayTypes.includes(key)) {
            // eslint-disable-next-line
            // @ts-ignore
            searchParamsInput[key] = (inputs[key] as string[]).join(",");
          }
        }
        if (config.redirectTo) {
          navigate({
            pathname: config.redirectTo,
            search: createSearchParams(searchParamsInput as any).toString(),
          });
          return;
        }
        console.log("sear====", searchParamsInput);
        setSearchParams(searchParamsInput as Record<string, string>, {
          replace: shouldReplaceFilters,
        });
      }
    },
    [activeStore, navigate, setSearchParams]
  );

  const getData = useCallback(
    <T extends true | false | undefined = false>(
      key: keyof CachedQuery,
      isArray?: T
    ): T extends true ? string[] : string => {
      const store = userInputCache[activeStore];
      const valueString = searchParams?.get(key) || "";

      const savedValue = store[key] || (isArray ? [] : "");

      let value = isArray
        ? valueString
          ? valueString.split(",")
          : savedValue || []
        : valueString || savedValue;

      if (
        isArray &&
        Array.isArray(savedValue) &&
        savedValue.join(",") === valueString
      ) {
        // if filters are same as saved filters, use reference of saved filters so the component doesn't re-render unnecessarily
        value = savedValue;
      }
      return value as any;
    },
    [activeStore, searchParams]
  );

  return useMemo(() => {
    const data = {
      address: getData("address", true),
      tokenType: getData("tokenType"),
      rawInput: getData("rawInput"),
      inputType: !isTokenBalances
        ? (getData("inputType") as CachedQuery["inputType"])
        : null,
      activeView: isTokenBalances ? "" : searchParams.get("activeView") || "",
      activeTokenInfo: searchParams.get("activeTokenInfo") || "",
      activeSnapshotInfo: getData("activeSnapshotInfo"),
      tokenFilters: !isTokenBalances ? getData("tokenFilters", true) : [],
      activeViewToken: isTokenBalances ? "" : getData("activeViewToken"),
      activeViewCount: isTokenBalances ? "" : getData("activeViewCount"),
      blockchainType: getData("blockchainType", true),
      sortOrder: getData("sortOrder"),
      spamFilter: getData("spamFilter"),
      mintFilter: getData("mintFilter"),
      resolve6551: searchParams.get("resolve6551") || "",
      activeSocialInfo: searchParams.get("activeSocialInfo") || "",
      activeENSInfo: searchParams.get("activeENSInfo") || "",
    };

    setData(data);

    return [data, setData, setSearchParams];
  }, [getData, isTokenBalances, setData, searchParams, setSearchParams]);
}
