import { Card } from './Card';
import { IconType } from './Icon';
import { IconWithBorder } from './IconWithBorder';
import { Link } from './Link';
const chains: { icon: IconType; label: string }[] = [
  {
    icon: 'ethereum',
    label: 'Ethereum'
  },
  {
    icon: 'polygon',
    label: 'Polygon'
  },
  {
    icon: 'base',
    label: 'Base'
  },
  {
    icon: 'zora',
    label: 'Zora'
  },
  {
    icon: 'optimism',
    label: 'Optimism'
  }
];
const defaultLink = 'https://app.airstack.xyz';

export function Chains() {
  return (
    <Card icon="chain" title="Chains">
      <div className="flex-row-h-center gap-x-12 sm:gap-x-10 gap-y-10 flex-wrap sm:flex-nowrap">
        {chains.map((chain, index) => {
          return (
            <Link
              to={defaultLink}
              key={index}
              className="h-[90px] sm:h-[104px] w-16"
            >
              <IconWithBorder
                key={index}
                name={chain.icon}
                label={chain.label}
              />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
