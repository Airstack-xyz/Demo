import { Card } from './Card';
import { IconWithBorder } from './IconWithBorder';
import { IconWithBranches } from './IconWithBranches';
import { Link } from './Link';

export function Socials() {
  return (
    <Card icon="socials" title="Socials, Domains & Messaging">
      <div className="[&>a]:h-[90px] flex items-start sm:items-center gap-10 flex-wrap sm:flex-nowrap">
        <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster">
          <IconWithBorder name="farcaster" label="Farcaster" />
        </Link>
        <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/lens">
          <IconWithBorder name="lens" label="Lens" />
        </Link>
        <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/xmtp">
          <IconWithBorder name="xmtp" label="XMTP" />
        </Link>
        <Link
          to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/ens-domains"
          className="relative"
        >
          <IconWithBranches
            name="ens"
            label="ENS"
            branches={['On-chain', 'Off-chain']}
          />
          <span className="text-[10px] opacity-50 absolute -bottom-2 sm:-bottom-2 right-0">
            cb.id, Namestone, & others
          </span>
        </Link>
      </div>
    </Card>
  );
}
