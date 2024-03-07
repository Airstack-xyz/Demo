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
      <div className="h-[104px] flex-row-h-center gap-10 flex-row-center">
        {chains.map((chain, index) => {
          return (
            <Link to={defaultLink} key={index}>
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
