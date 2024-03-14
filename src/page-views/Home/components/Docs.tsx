import { Icon, IconType } from './Icon';
import { Link } from './Link';

type Info = {
  title: string;
  icon: IconType;
  description: string;
  link: string;
};
const items: Info[] = [
  {
    title: 'Airstack Frog Recipes',
    icon: 'frog',
    description:
      'Build your Farcaster Frames using Airstack Frog Recipes. Seamlessly integrate allow list and everything onchain into Frames.',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/airstack-frog-recipes'
  },
  {
    title: 'Airstack Frames SDK',
    icon: 'frames-sdk',
    description:
      'Empowers developers to seamlessly integrate everything Airstack offers into  Frames using just a few lines of code.',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster-frames'
  },
  {
    title: 'Onchain Kit for Farcaster Frames',
    icon: 'on-chain',
    description:
      'Enables you to build Farcaster Frames with onchain data, including channels, token balances, token mints, Farcaster follows, POAPs, Base, Zora & more.',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster/airstack-onchain-kit-for-farcaster-frames'
  },
  {
    title: 'Activate Kit for Farcaster',
    icon: 'farcaster-kit',
    description:
      'Enables you to execute a series of API calls to activate Farcaster users after they connect with Farcaster Auth Kit.',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster/activate-kit-for-farcaster-auth-kit'
  },
  {
    title: 'Allow Lists for Frames',
    icon: 'allow-list',
    description:
      'Create dynamic allow lists that check in real-time if a user qualifies to use your Frame based on your preferred criteria.',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster/proof-of-personhood-for-farcaster-frames'
  },
  {
    title: 'Farcaster App APIs',
    icon: 'farcaser-api',
    description:
      'Easily Integrate Farcaster into your app. Fetch FIDs, usernames, profiles, photos, connected addresses, followers, following, social graph, onchain graphs, channels, channel leads, channel details, NFTs, tokens, POAPs.',
    link: 'https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster'
  }
];

function Item({ title, icon, description, link }: Info) {
  return (
    <li className="card w-full sm:w-[355px] h-[376px] px-5 pt-10 pb-6 rounded-2xl text-left flex flex-col justify-between">
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
        <Link to={link} className="font-semibold text-text-button">
          Read more <span>{'->'}</span>
        </Link>
      </div>
    </li>
  );
}

export function Docs() {
  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-7 justify-items-center sm:justify-items-start">
        {items.map(item => (
          <Item key={item.title} {...item} />
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row items-center justify-center mt-7">
        <Link
          to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster/airstack-onchain-kit-for-farcaster-frames#validate-frames-signature-packet"
          className="card font-semibold text-xl px-7 flex items-center rounded-3xl h-16 w-full sm:w-[363px]"
        >
          <Icon name="frames-validator" loading="eager" />
          <span className="ml-1.5">Frames Validator</span>
        </Link>
        <Link
          to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/farcaster-frames"
          className="card font-semibold text-xl px-7 flex items-center rounded-3xl h-16 w-full sm:w-[363px] ml-0 sm:ml-7 mt-5 sm:mt-0"
        >
          <Icon name="frames-sdk" loading="eager" />
          <span className="ml-1.5">Frames Captcha SDK</span>
        </Link>
        <Link
          to="https://docs.airstack.xyz/airstack-docs-and-faqs/guides/no-code-frames"
          className="card font-semibold text-xl px-7 flex items-center rounded-3xl h-16 w-full sm:w-[363px] ml-0 sm:ml-7 mt-5 sm:mt-0"
        >
          <Icon name="no-code-frame" loading="eager" />
          <span className="ml-1.5">No-Code Frames</span>
        </Link>
      </div>
    </div>
  );
}
