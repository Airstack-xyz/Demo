import { IconWithBorder } from './IconWithBorder';
import { IconType } from './Icon';

type ItemType = {
  icon: IconType;
  label: string;
  textColor: string;
  link: string;
};

const items: ItemType[] = [
  {
    icon: 'coinbase',
    label: 'Coinbase',
    textColor: '#0352FD',
    link: ''
  },
  {
    icon: 'karama',
    label: 'Karma3Labs',
    textColor: '#F3FF7A',
    link: ''
  },
  {
    icon: 'xmtp',
    label: 'XMTP',
    textColor: '#EC4342',
    link: ''
  },
  {
    icon: 'icebreaker',
    label: 'Icebreaker',
    textColor: '',
    link: ''
  },
  {
    icon: 'gold',
    label: 'Gold L3',
    textColor: '#81A9FE',
    link: ''
  },
  {
    icon: 'buttrfly',
    label: 'Buttrfly',
    textColor: '#3DBDF5',
    link: ''
  },
  {
    icon: 'converse',
    label: 'Converse',
    textColor: '#FA594A',
    link: ''
  },
  {
    icon: 'holder',
    label: 'Holder',
    textColor: '#808285',
    link: ''
  },
  {
    icon: 'orb',
    label: 'Orb',
    textColor: '#4D4D4F',
    link: ''
  },
  {
    icon: 'union-finance',
    label: 'Union Finance',
    textColor: '',
    link: ''
  },
  {
    icon: 'unlonely',
    label: 'Unlonely',
    textColor: '#37FF8B',
    link: ''
  },
  {
    icon: 'lenspost',
    label: 'Lenspost',
    textColor: '',
    link: ''
  },
  {
    icon: 'phala-network',
    label: 'Phala Network',
    textColor: '',
    link: ''
  },
  {
    icon: 'payflow',
    label: 'Payflow',
    textColor: '',
    link: ''
  },
  {
    icon: 'tokenbound',
    label: 'Tokenbound',
    textColor: '#808285',
    link: ''
  },
  {
    icon: 'builder-fi',
    label: 'Builder.fi',
    textColor: '#1767DD',
    link: ''
  },
  {
    icon: 'bonfire',
    label: 'Bonfire',
    textColor: '#7361C6',
    link: ''
  },
  {
    icon: 'minglee',
    label: 'Minglee',
    textColor: '#4468B1',
    link: ''
  },
  {
    icon: 'unstoppable-domains',
    label: 'Unstoppable Domains',
    textColor: '#4C47F7',
    link: ''
  },
  {
    // @ts-ignore
    icon: '', // TODO: Add icon
    label: 'Jam',
    textColor: '#BD38AB',
    link: ''
  },
  {
    icon: 'neura-name',
    label: 'NeuraName',
    textColor: '#0482D9',
    link: ''
  },
  {
    icon: 'receipts',
    label: 'Receipts',
    textColor: '#CFFD34',
    link: ''
  },
  {
    icon: 'firefly',
    label: 'Firefly',
    textColor: '#4D44C0',
    link: ''
  },
  {
    icon: 'gandalf',
    label: 'Gandalf',
    textColor: '#6610F2',
    link: ''
  }
];

export function LiveIntegrations() {
  return (
    <div className="border border-dashed border-[#7e7e7e] px-12 pb-2 flex-col-center relative">
      <div className="grid grid-cols-6 gap-11 bg-primary relative -top-7">
        {items.map((item, index) => (
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
        Live Integrations
      </div>
    </div>
  );
}
