import { Card } from './Card';
import { IconWithBorder } from './IconWithBorder';
import { IconWithBranches } from './IconWithBranches';

export function Socials() {
  return (
    <Card icon="socials" title="Socials, Domains & Messaging">
      <div className="h-[104px] flex-row-h-center gap-10 flex-row-center">
        <IconWithBorder name="allow-list" label="Farcaster" />
        <IconWithBorder name="allow-list" label="Lens" />
        <span className="relative">
          <IconWithBranches
            name="allow-list"
            label="Lens"
            branches={['On-chain', 'Off-chain']}
          />
          <span className="text-[10px] opacity-50 absolute -bottom-6 right-0">
            cb.id, Namestone, & others
          </span>
        </span>
        <IconWithBorder name="allow-list" label="XMTP" />
      </div>
    </Card>
  );
}
