import { Card } from './Card';
import { IconWithBorder } from './IconWithBorder';
import { IconWithBranches } from './IconWithBranches';
import { Link } from './Link';

export function Socials() {
  return (
    <Card icon="socials" title="Socials, Domains & Messaging">
      <div className="h-[104px] flex-row-h-center gap-10 flex-row-center">
        <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster">
          <IconWithBorder name="allow-list" label="Farcaster" />
        </Link>
        <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/lens">
          <IconWithBorder name="allow-list" label="Lens" />
        </Link>
        <Link
          to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/ens-domains"
          className="relative"
        >
          <IconWithBranches
            name="allow-list"
            label="Lens"
            branches={['On-chain', 'Off-chain']}
          />
          <span className="text-[10px] opacity-50 absolute -bottom-6 right-0">
            cb.id, Namestone, & others
          </span>
        </Link>
        <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/xmtp">
          <IconWithBorder name="allow-list" label="XMTP" />
        </Link>
      </div>
    </Card>
  );
}
