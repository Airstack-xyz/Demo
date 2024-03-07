import { Link } from './Link';
import { Card } from './Card';
import { IconWithBorder } from './IconWithBorder';
import { IconWithBranches } from './IconWithBranches';

export function Tokens() {
  return (
    <Card icon="events" title="Tokens">
      <ul className="flex-row-h-center gap-x-3 sm:gap-x-10 gap-y-10 [&>li]:h-[90px] [&>li]:flex-col-v-center [&>li]:justify-start flex-wrap sm:flex-nowrap">
        <li className="ml-2 relative">
          <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/erc20">
            <IconWithBorder name="abstraction-modules" label="Tokens" />
            <div className="text-[10px] opacity-50 absolute mt-1 w-full bottom-0">
              ERC20
            </div>
          </Link>
        </li>
        <li className="ml-2">
          <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/nft">
            <IconWithBranches
              name="abstraction-modules"
              label="NFTs"
              labelClass="bg-[#EC4442]"
              branches={['Metadata', 'Resized Images']}
            />
            <div className="text-[10px] opacity-50 w-16 mt-2 ml-2 absolute">
              ERC721, 1155
            </div>
          </Link>
        </li>
        <li className="relative">
          <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/token-bound-accounts">
            <div className="relative">
              <IconWithBorder
                name="accounts"
                label="Accounts"
                labelClass="bg-[#303241]"
              />
            </div>
            <div className="text-[10px] opacity-50 mt-1 absolute w-full bottom-0">
              ERC6551
            </div>
          </Link>
        </li>
        <li className="flex flex-col justify-center">
          <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/token-balances">
            <IconWithBorder
              name="balances"
              label="Balances"
              labelClass="bg-[#303241]"
            />
          </Link>
        </li>
        <li className="flex flex-col justify-center">
          <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/token-holders">
            <IconWithBorder
              name="holders"
              label="Holders"
              labelClass="bg-[#303241]"
            />
          </Link>
        </li>
        <li className="flex flex-col justify-center">
          <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/token-transfers">
            <IconWithBorder
              name="transfers"
              label="Transfers"
              labelClass="bg-[#303241]"
            />
          </Link>
        </li>
        <li className="flex flex-col justify-center">
          <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/token-mints">
            <IconWithBorder
              name="mints"
              label="Mints"
              labelClass="bg-[#303241]"
            />
          </Link>
        </li>
      </ul>
    </Card>
  );
}
