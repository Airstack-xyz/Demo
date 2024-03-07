import { Card } from './Card';
import { IconWithBorder } from './IconWithBorder';
import { Link } from './Link';

export function Events() {
  return (
    <Card icon="events" title="Events" className="w-[185px]">
      <div className="h-[104px] flex-row-center items-start">
        <Link to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/poap">
          <IconWithBorder name="poaps" label="POAPs" />
        </Link>
      </div>
    </Card>
  );
}
