import { IconWithBorder } from './IconWithBorder';
import { IconType } from './Icon';
import { Link } from './Link';

type ItemType = {
  icon: IconType;
  label: string;
  textColor: string;
  link: string;
};
const firstRowItems: ItemType[] = [
  {
    icon: 'farcaster',
    label: 'Farcaster',
    textColor: '#7863A5',
    link: 'https://www.farcaster.xyz/'
  },
  {
    icon: 'ens',
    label: 'ENS',
    textColor: '#515CFF',
    link: 'https://ens.domains/'
  },
  {
    icon: 'xmtp',
    label: 'XMTP',
    textColor: '#EC4342',
    link: 'https://xmtp.org/'
  },
  {
    icon: 'lens',
    label: 'Lens',
    textColor: '',
    link: 'https://www.lens.xyz/'
  },
  {
    icon: 'tokenbound',
    label: 'ERC-6551',
    textColor: '#939598',
    link: 'https://tokenbound.org/'
  }
];

const secondRowItems: ItemType[] = [
  {
    icon: 'poaps',
    label: 'POAPs',
    textColor: '#6C6DAC',
    link: 'https://poap.xyz/'
  },
  {
    icon: 'base',
    label: 'Base',
    textColor: '#81A9FE',
    link: 'https://www.base.org/'
  },
  {
    icon: 'zora',
    label: 'Zora',
    textColor: '#3B6FE5',
    link: 'https://zora.co/'
  },
  {
    icon: 'polygon',
    label: 'Polygon',
    textColor: '#8247E5',
    link: 'https://polygon.technology/'
  },
  {
    icon: 'optimism',
    label: 'Optimism',
    textColor: '#FF0420',
    link: 'https://www.optimism.io/'
  },
  {
    icon: 'syndicate',
    label: 'Syndicate',
    textColor: '#FFF',
    link: 'https://syndicate.io/'
  }
];

export function Partners() {
  return (
    <div>
      <h2 className="text-[22px] sm:text-4xl font-semibold pb-20">
        Innovators build with Airstack
      </h2>
      <div className="border border-dashed border-[#7e7e7e] px-12 pb-12 flex-col-center relative">
        <div className="flex-row-h-center gap-11 bg-primary relative -top-7 flex-wrap sm:flex-nowrap px-0 sm:px-20">
          {firstRowItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <IconWithBorder
                key={index}
                name={item.icon}
                label={item.label}
                labelClass="text-xs bg-transparent mt-0.5"
                labelStyles={{
                  color: item.textColor
                }}
              />
            </Link>
          ))}
        </div>
        <div className="flex-row-h-center gap-11 mt-5 flex-wrap sm:flex-nowrap [&>a]:w-16">
          {secondRowItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <IconWithBorder
                key={index}
                name={item.icon}
                label={item.label}
                labelClass="text-xs bg-transparent mt-0.5"
                labelStyles={{
                  color: item.textColor
                }}
              />
            </Link>
          ))}
        </div>
        <div className="absolute -bottom-2 bg-primary px-3 m-auto">
          Ecosystem Partners
        </div>
      </div>
    </div>
  );
}
