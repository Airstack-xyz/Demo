import { IconWithBorder } from './IconWithBorder';
import { IconType } from './Icon';
import { Link } from './Link';

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
    link: 'https://www.coinbase.com/'
  },
  {
    icon: 'karama',
    label: 'Karma3Labs',
    textColor: '#F3FF7A',
    link: 'https://karma3labs.com/'
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
    link: 'https://www.icebreaker.xyz/'
  },
  {
    icon: 'gold',
    label: 'Gold L3',
    textColor: '#81A9FE',
    link: 'https://www.gold.dev/'
  },
  {
    icon: 'buttrfly',
    label: 'Buttrfly',
    textColor: '#3DBDF5',
    link: 'https://buttrfly.app/explore'
  },
  {
    icon: 'converse',
    label: 'Converse',
    textColor: '#FA594A',
    link: 'https://getconverse.app/'
  },
  {
    icon: 'holder',
    label: 'Holder',
    textColor: '#808285',
    link: 'https://www.holder.xyz/'
  },
  {
    icon: 'orb',
    label: 'Orb',
    textColor: '#4D4D4F',
    link: 'https://orb.ac/'
  },
  {
    icon: 'union-finance',
    label: 'Union Finance',
    textColor: '',
    link: 'https://union.finance/'
  },
  {
    icon: 'unlonely',
    label: 'Unlonely',
    textColor: '#37FF8B',
    link: 'https://www.unlonely.app/'
  },
  {
    icon: 'lenspost',
    label: 'Lenspost',
    textColor: '',
    link: 'https://www.lenspost.xyz/'
  },
  {
    icon: 'phala-network',
    label: 'Phala Network',
    textColor: 'https://phala.network/',
    link: ''
  },
  {
    icon: 'payflow',
    label: 'Payflow',
    textColor: '',
    link: 'https://payflow.me/'
  },
  {
    icon: 'tokenbound',
    label: 'Tokenbound',
    textColor: '#808285',
    link: 'https://tokenbound.org/'
  },
  {
    icon: 'builder-fi',
    label: 'Builder.fi',
    textColor: '#1767DD',
    link: 'https://www.builder.fi/'
  },
  {
    icon: 'bonfire',
    label: 'Bonfire',
    textColor: '#7361C6',
    link: 'https://www.bonfire.xyz/'
  },
  {
    icon: 'minglee',
    label: 'Minglee',
    textColor: '#4468B1',
    link: 'https://minglee.io/'
  },
  {
    icon: 'unstoppable-domains',
    label: 'Unstoppable Domains',
    textColor: '#4C47F7',
    link: 'https://unstoppabledomains.com/'
  },
  {
    icon: 'hypeshot',
    label: 'Hypeshot',
    textColor: '',
    link: 'https://www.hypeshot.io/'
  },
  {
    icon: 'neura-name',
    label: 'NeuraName',
    textColor: '#0482D9',
    link: 'https://www.neuraname.com/'
  },
  {
    icon: 'receipts',
    label: 'Receipts',
    textColor: '#CFFD34',
    link: 'https://www.receipts.xyz/'
  },
  {
    icon: 'firefly',
    label: 'Firefly',
    textColor: '#4D44C0',
    link: 'https://firefly.land/'
  },
  {
    icon: 'gandalf',
    label: 'Gandalf',
    textColor: '#6610F2',
    link: 'https://gandalf.network/'
  },
  {
    icon: 'interface',
    label: 'Interface',
    textColor: '',
    link: 'https://www.interface.social/'
  },
  {
    icon: 'vocdoni',
    label: 'Vocdoni',
    textColor: '#CBF5C8',
    link: 'https://www.vocdoni.io/'
  },
  {
    icon: 'repute-x',
    label: 'ReputeX',
    textColor: '#807EF9',
    link: 'https://reputex.io/'
  },
  {
    icon: 'talent-protocol',
    label: 'Talent Protocol',
    textColor: '#0482D9',
    link: 'https://www.talentprotocol.com/'
  }
];

export function LiveIntegrations() {
  return (
    <div className="border border-dashed border-[#7e7e7e] px-8 pb-2 flex-col-center relative">
      <div className="px-2 sm:px-3 bg-primary relative -top-7">
        <div className="flex justify-center flex-wrap gap-11 [&>a]:w-16">
          {items.map((item, index) => (
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
      </div>
      <div className="absolute -bottom-2 bg-primary px-3 m-auto">
        Live Integrations
      </div>
    </div>
  );
}
