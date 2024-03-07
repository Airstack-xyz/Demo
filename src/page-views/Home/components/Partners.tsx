import { IconWithBorder } from './IconWithBorder';
import { IconType } from './Icon';

type ItemType = {
  icon: IconType;
  label: string;
  textColor: string;
  link: string;
};
const firstRowITems: ItemType[] = [
  {
    icon: 'farcaster',
    label: 'Farcaster',
    textColor: '#7863A5',
    link: ''
  },
  {
    icon: 'ens',
    label: 'ENS',
    textColor: '#515CFF',
    link: ''
  },
  {
    icon: 'xmtp',
    label: 'XMTP',
    textColor: '#EC4342',
    link: ''
  },
  {
    icon: 'lens',
    label: 'Lens',
    textColor: '',
    link: ''
  },
  {
    icon: 'tokenbound',
    label: 'ERC-6551',
    textColor: '#939598',
    link: ''
  }
];

const secondRowItems: ItemType[] = [
  {
    icon: 'poaps',
    label: 'POAPs',
    textColor: '#6C6DAC',
    link: ''
  },
  {
    icon: 'base',
    label: 'Base',
    textColor: '#81A9FE',
    link: ''
  },
  {
    icon: 'zora',
    label: 'Zora',
    textColor: '#3B6FE5',
    link: ''
  },
  {
    icon: 'polygon',
    label: 'Polygon',
    textColor: '#8247E5',
    link: ''
  },
  {
    icon: 'optimism',
    label: 'Optimism',
    textColor: '#FF0420',
    link: ''
  },
  {
    icon: 'syndicate',
    label: 'Syndicate',
    textColor: '#FFF',
    link: ''
  }
];

export function Partners() {
  return (
    <div>
      <h2 className="text-3xl font-semibold pb-20">
        Innovators build with Airstack
      </h2>
      <div className="border border-dashed border-[#7e7e7e] px-12 pb-12 flex-col-center relative">
        <div className="flex-col-h-center gap-11 bg-primary relative -top-7">
          {firstRowITems.map((item, index) => (
            <IconWithBorder
              key={index}
              name={item.icon}
              label={item.label}
              labelClass="text-xs bg-transparent mt-0.5"
              labelStyles={{
                color: item.textColor
              }}
            />
          ))}
        </div>
        <div className="flex-col-h-center gap-11 mt-5">
          {secondRowItems.map((item, index) => (
            <IconWithBorder
              key={index}
              name={item.icon}
              label={item.label}
              labelClass="text-xs bg-transparent mt-0.5"
              labelStyles={{
                color: item.textColor
              }}
            />
          ))}
        </div>
        <div className="absolute -bottom-2 bg-primary px-3 m-auto">
          Ecosystem Partners
        </div>
      </div>
    </div>
  );
}
