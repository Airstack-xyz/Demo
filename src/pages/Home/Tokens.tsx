import { Card } from './Card';
import { IconWithBorder } from './IconWithBorder';
import { IconWithBranches } from './IconWithBranches';

export function Tokens() {
  return (
    <Card icon="events" title="Tokens">
      <ul className="flex-row-h-center gap-10 [&>li]:h-[104px] [&>li]:flex-col-v-center">
        <li className="ml-2 relative">
          <IconWithBorder name="abstraction-modules" label="Tokens" />
          <div className="text-[10px] opacity-50 absolute mt-1 w-full bottom-0">
            ERC20
          </div>
        </li>
        <li className="ml-2">
          <IconWithBranches
            name="abstraction-modules"
            label="NFTs"
            subText="ERC721, 1155"
            labelClass="bg-[#EC4442]"
            branches={['Metadata', 'Resized Images']}
          />
        </li>
        <li className="relative">
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
        </li>
        <li className="flex flex-col justify-center">
          <IconWithBorder
            name="balances"
            label="Balances"
            labelClass="bg-[#303241]"
          />
        </li>
        <li className="flex flex-col justify-center">
          <IconWithBorder
            name="holders"
            label="Holders"
            labelClass="bg-[#303241]"
          />
        </li>
        <li className="flex flex-col justify-center">
          <IconWithBorder
            name="transfers"
            label="Transfers"
            labelClass="bg-[#303241]"
          />
        </li>
        <li className="flex flex-col justify-center">
          <IconWithBorder
            name="mints"
            label="Mints"
            labelClass="bg-[#303241]"
          />
        </li>
      </ul>
    </Card>
  );
}
