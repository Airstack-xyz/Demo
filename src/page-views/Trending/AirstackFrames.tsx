import { TrendingHorizontalList } from './TrendingHorizontalList';
import { Image } from '@/Components/Image';
import { Link } from '@/Components/Link';
import { Icon } from '@/Components/Icon';

type FrameProps = {
  image: string;
  title: string;
  description: string;
  url: string;
};

function Frame({ image, title, description, url }: FrameProps) {
  return (
    <div className="w-72 h-[335px] card hover:bg-card-hover cursor-pointer rounded-18 flex flex-col">
      <div className="h-[152px]">
        <Image src="" className="h-full w-auto bg-black rounded-t-18" />
      </div>
      <div className="p-5 overflow-hidden text-sm flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <h3 className="font-bold">{title}</h3>
          <p className="leading-5 mb-3 mt-2 text-text-secondary line-clamp-3">
            {description}
          </p>
        </div>
        <div className="flex items-center">
          <Link
            to={url}
            className="bg-white text-black flex-row-center gap-1 px-3 py-1 rounded-full font-medium"
            target="_blank"
          >
            <Icon name="farcaster-flat-dark" /> Try Frame
          </Link>
          <Link
            to={url}
            target="_blank"
            className="border border-solid px-3 py-1 rounded-full ml-4"
          >
            <Icon name="share-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}

type Item = {
  image: string;
  title: string;
  description: string;
  url: string;
};

const items: Item[] = [
  {
    image: 'Trending Mints by Farcasters ',
    title: 'Trending Mints by Farcasters ',
    description:
      'A frame-based, onchain battle game. Phase 1 is now live: Join the /warcaster is now live is now live and you can try it out now.',
    url: 'https://warpcast.com/betashop.eth/0xf2cbf1e5'
  },
  {
    image: 'Trending Mints by Farcasters ',
    title: 'Trending Mints by Farcasters ',
    description:
      'A frame-based, onchain battle game. Phase 1 is now live: Join the /warcaster is now live is now live and you can try it out now.',
    url: 'https://warpcast.com/betashop.eth/0xf2cbf1e5'
  }
];

export function AirstackFrames() {
  return (
    <TrendingHorizontalList
      data={items}
      getApiLink=""
      icon="trending-mints"
      onViewFrameClick={() => {}}
      onItemClick={() => {}}
      title="Frames by Airstack"
      viewAllLink=""
      renderItem={item => (
        <Frame
          title={item.title}
          description={item.description}
          image={item.image}
          url={item.url}
        />
      )}
    />
  );
}
