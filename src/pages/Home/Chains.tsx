import { Card } from './Card';
import { IconWithBorder } from './IconWithBorder';

export function Chains() {
  return (
    <Card icon="chain" title="Chains">
      <div className="h-[104px] flex-row-h-center gap-10 flex-row-center">
        <IconWithBorder name="ethereum" label="Ethereum" />
        <IconWithBorder name="polygon" label="Polygon" />
        <IconWithBorder name="base" label="Base" />
        <IconWithBorder name="zora" label="Zora" />
        <IconWithBorder name="optimism" label="Optimism" />
      </div>
    </Card>
  );
}
