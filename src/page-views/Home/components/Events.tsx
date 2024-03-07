import { Card } from './Card';
import { IconWithBorder } from './IconWithBorder';

export function Events() {
  return (
    <Card icon="events" title="Events" className="w-[185px]">
      <div className="h-[104px] flex-row-center">
        <IconWithBorder name="allow-list" label="POAPs" />
      </div>
    </Card>
  );
}
