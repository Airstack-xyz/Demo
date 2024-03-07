import { Icon, IconType } from './Icon';

type Info = {
  title: string;
  icon: IconType;
  description: string;
  link: string;
};
const items: Info[] = [
  {
    title: 'Airstack Frames SDK',
    icon: 'frames-sdk',
    description:
      'Empowers developers to seamlessly integrate everything Airstack offers into  Frames using just a few lines of code.',
    link: ''
  },
  {
    title: 'Onchain Kit for Farcaster Frames',
    icon: 'on-chain',
    description:
      'Enables you to build Farcaster Frames with onchain data, including channels, token balances, token mints, Farcaster follows, POAPs, Base, Zora & more.',
    link: ''
  },
  {
    title: 'Activate Kit for Farcaster',
    icon: 'farcaster-kit',
    description:
      'Enables you to execute a series of API calls to activate Farcaster users after they connect with Farcaster Auth Kit.',
    link: ''
  },
  {
    title: 'Allow Lists for Frames',
    icon: 'allow-list',
    description:
      'Create dynamic allow lists that check in real-time if a user qualifies to use your Frame based on your preferred criteria.',
    link: ''
  },
  {
    title: 'No-Code Frames',
    icon: 'no-code-frame',
    description:
      'Create Frames using Airstack No-Code Frames Builder in just a few clicks. Currently available for fetching Token balances & Token holders.',
    link: ''
  },
  {
    title: 'Farcaster App APIs',
    icon: 'farcaser-api',
    description:
      'Easily Integrate Farcaster into your app. Fetch FIDs, usernames, profiles, photos, connected addresses, followers, following, social graph, onchain graphs, channels, channel leads, channel details, NFTs, tokens, POAPs.',
    link: ''
  }
];

function Item({ title, icon, description, link }: Info) {
  return (
    <li className="card w-[336px] h-[376px] px-5 pt-10 pb-6 rounded-2xl text-left flex flex-col justify-between">
      <div>
        <div className="flex">
          <span className="bg-white bg-opacity-5 p-3 rounded-lg">
            <Icon name={icon} height={36} width={36} loading="eager" />
          </span>
        </div>
        <h3 className="text-xl mb-3 mt-5">{title}</h3>
        <div className="text-base text-[#868D94] mb-6">{description}</div>
      </div>
      <div>
        <a href="/docs/frames-sdk" className="font-semibold text-text-button">
          Read more <span>{'->'}</span>
        </a>
      </div>
    </li>
  );
}

export function Docs() {
  return (
    <div>
      <ul className="grid grid-cols-3 gap-7">
        {items.map(item => (
          <Item key={item.title} {...item} />
        ))}
      </ul>
      <div className="flex items-center justify-center mt-7">
        <a
          href="/docs"
          className="card font-semibold text-xl ml-7 px-7 flex items-center rounded-3xl h-16 w-[363px]"
        >
          <Icon name="frames-validator" loading="eager" />
          <span className="ml-1.5">Frames Validator</span>
        </a>
        {/* <a
          href="/docs"
          className="card font-semibold text-xl ml-7 px-7 flex items-center rounded-3xl h-16 w-[363px]"
        >
          Frames Captcha SDK
        </a> */}
      </div>
    </div>
  );
}
