import classNames from "classnames";
import { Icon, IconType } from "../Icon";
import { isMobileDevice } from "../../utils/isMobileDevice";
import { usePathname } from "next/navigation";
import { Link } from "@/Components/Link";

const tabClass =
  "px-2.5 h-[30px] rounded-full mr-3 flex-row-center text-xs text-text-secondary border border-solid border-transparent";

const activeTabClass =
  "bg-glass !border-stroke-color font-bold !text-text-primary";

export type TabUrl = "token-balances" | "token-holders" | "channels";

const options: {
  label: string;
  mobileLabel: string;
  value: TabUrl;
  extraMatch?: string[];
}[] = [
  {
    label: "Token balances",
    mobileLabel: "Balances",
    value: "token-balances",
    extraMatch: ["onchain-graph"],
  },
  { label: "Token holders", mobileLabel: "Holders", value: "token-holders" },
  { label: "Channels", mobileLabel: "Channels", value: "channels" },
];

function TabLinks() {
  const isMobile = isMobileDevice();
  const activePath = usePathname() || "";
  return (
    <>
      {options.map((option, index) => {
        const isActive =
          activePath.includes(option.value) ||
          (option.extraMatch || []).some((match) => activePath.includes(match));
        return (
          <Link
            key={index}
            to={`/${option.value}`}
            className={classNames(tabClass, {
              [activeTabClass]: isActive,
            })}
          >
            <Icon name={option.value as IconType} className="w-4 mr-1" />{" "}
            {isMobile ? option.mobileLabel : option.label}
          </Link>
        );
      })}
    </>
  );
}

function TabButtons({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (activeTab: TabUrl) => void;
}) {
  const isMobile = isMobileDevice();
  return (
    <>
      {options.map((option, index) => {
        return (
          <button
            key={index}
            onClick={() => onTabChange(option.value)}
            className={classNames(tabClass, {
              [activeTabClass]: activeTab === option.value,
            })}
          >
            <Icon name={option.value as IconType} className="w-4 mr-1" />{" "}
            {isMobile ? option.mobileLabel : option.label}
          </button>
        );
      })}
    </>
  );
}

export function SearchTabSection({
  isHome,
  activeTab,
  onTabChange,
}: {
  isHome: boolean;
  activeTab: TabUrl;
  onTabChange: (activeTab: TabUrl) => void;
}) {
  return (
    <div className="bg-glass bg-secondary border flex p-1 rounded-full">
      {isHome ? (
        <TabButtons activeTab={activeTab} onTabChange={onTabChange} />
      ) : (
        <TabLinks />
      )}
    </div>
  );
}
