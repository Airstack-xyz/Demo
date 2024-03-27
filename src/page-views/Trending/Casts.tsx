import { TrendingHorizontalList } from './TrendingHorizontalList';
import { Link } from '@/Components/Link';
import { Icon } from '@/Components/Icon';
import ImageWithFallback from '@/Components/ImageWithFallback';

type CastType = {
  profileImage: string;
  castPreviewImage: string;
  name: string;
  handle: string;
  description: string;
  url: string;
  likes: number;
  comments: number;
  recasts: number;
  time: string;
};

function LikeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="11"
      viewBox="0 0 10 11"
      fill="none"
    >
      <path
        d="M0.833008 3.92669C0.833008 5.9529 2.50777 7.03265 3.73373 7.99911C4.16634 8.34015 4.58301 8.66123 4.99967 8.66123C5.41634 8.66123 5.83301 8.34015 6.26563 7.99911C7.49159 7.03265 9.16634 5.9529 9.16634 3.92669C9.16634 1.90047 6.87459 0.463512 4.99967 2.4115C3.12474 0.463512 0.833008 1.90047 0.833008 3.92669Z"
        fill="#868D94"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.75293 4.45573C1.75293 3.52231 1.75293 3.0556 1.93458 2.69908C2.09438 2.38547 2.34934 2.13051 2.66295 1.97072C3.01947 1.78906 3.48618 1.78906 4.4196 1.78906H6.58626C7.51968 1.78906 7.98639 1.78906 8.34293 1.97072C8.65651 2.13051 8.91147 2.38547 9.07126 2.69908C9.25293 3.0556 9.25293 3.52231 9.25293 4.45573V4.95573C9.25293 5.88915 9.25293 6.35585 9.07126 6.7124C8.91147 7.02598 8.65651 7.28094 8.34293 7.44073C7.98639 7.6224 7.51968 7.6224 6.58626 7.6224H3.59218C3.48168 7.6224 3.3757 7.66631 3.29756 7.74444L2.46423 8.57777C2.20174 8.84027 1.75293 8.65435 1.75293 8.28315V7.6224V5.53906V4.45573ZM4.25293 3.45573C4.02281 3.45573 3.83626 3.64228 3.83626 3.8724C3.83626 4.10251 4.02281 4.28906 4.25293 4.28906H6.75293C6.98305 4.28906 7.1696 4.10251 7.1696 3.8724C7.1696 3.64228 6.98305 3.45573 6.75293 3.45573H4.25293ZM4.25293 5.1224C4.02281 5.1224 3.83626 5.30894 3.83626 5.53906C3.83626 5.76919 4.02281 5.95573 4.25293 5.95573H5.50293C5.73305 5.95573 5.9196 5.76919 5.9196 5.53906C5.9196 5.30894 5.73305 5.1224 5.50293 5.1224H4.25293Z"
        fill="#868D94"
      />
    </svg>
  );
}

function RecastIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
    >
      <g clip-path="url(#clip0_5719_349)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.7941 4.49609H10.2225C9.91845 2.37672 8.10063 0.746094 5.89719 0.746094C4.19438 0.746094 2.72251 1.72109 1.99938 3.14109L3.17282 3.59233C3.70845 2.64046 4.72688 1.99609 5.89719 1.99609C7.40907 1.99609 8.67001 3.06984 8.95939 4.49609H8.20626C8.10938 4.59016 8.01688 4.64797 8.15563 4.81079L9.32126 5.99641C9.41813 6.09016 9.57469 6.09016 9.67094 5.99641L10.8447 4.81079C10.9413 4.71672 10.8906 4.59016 10.7941 4.49609ZM5.89719 8.24609C4.49782 8.24609 3.31376 7.32641 2.91564 6.05859H3.59938C3.69626 5.96484 3.74657 5.83797 3.65032 5.74422L2.47657 4.55827C2.38 4.46452 2.22344 4.46452 2.12688 4.55827L0.960948 5.74422C0.82251 5.90704 0.915006 5.96484 1.01157 6.05859H1.58438C1.92345 7.91266 3.72251 9.49609 5.89719 9.49609C7.48876 9.49609 8.87751 8.64329 9.64313 7.37266L8.46032 6.90578C7.89594 7.71547 6.95876 8.24609 5.89719 8.24609Z"
          fill="#868D94"
        />
      </g>
      <defs>
        <clipPath id="clip0_5719_349">
          <rect
            width="10"
            height="10"
            fill="white"
            transform="translate(0.897461 0.121094)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function Cast({
  castPreviewImage,
  name,
  handle,
  description,
  url,
  likes,
  comments,
  recasts,
  time
}: CastType) {
  return (
    <div className="w-72 h-[366px] card hover:bg-card-hover cursor-pointer rounded-18 flex flex-col">
      <div className="p-5 overflow-hidden text-sm flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <ImageWithFallback
              fallback="/images/placeholder.svg"
              src=""
              className="size-8 rounded-full"
            />
            <h3 className="font-bold ml-1.5 mr-1 text-xs">{name}</h3>
            <span className="text-[11px] text-text-secondary">
              @{handle} <span>• {time}h</span>
            </span>
          </div>
          <p className="leading-5 mt-2 text-text-secondary line-clamp-3">
            {description}
          </p>
          <ImageWithFallback
            src={castPreviewImage}
            fallback="/images/placeholder.svg"
            className="h-36 w-full rounded-18 my-3"
          />
          <div className="flex items-center gap-2.5 text-xs text-text-secondary pb-2">
            <div className="flex-row-center gap-1">
              <LikeIcon />
              {likes} likes
            </div>
            <div className="flex-row-center gap-1">
              <CommentIcon />
              {comments} comments
            </div>
            <div className="flex-row-center gap-1">
              <RecastIcon />
              {recasts} recasts
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Link
            to={url}
            className="bg-white text-black flex-row-center gap-1 px-3 py-1 rounded-full font-medium"
            target="_blank"
          >
            <Icon name="farcaster-flat-dark" /> View Cast
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

const items: CastType[] = [
  {
    castPreviewImage: '',
    profileImage: '',
    name: 'Jason Goldberg',
    handle: 'betashop.eth',
    time: '2',
    likes: 10,
    comments: 5,
    recasts: 2,
    description:
      'top 10 on the Airstack Leaderboard are sharing 200,000 $DEGEN come Tuesday (currently worth $1800). 5 random use...',

    url: 'https://warpcast.com/betashop.eth/0xf2cbf1e5'
  }
];

export function Casts() {
  return (
    <TrendingHorizontalList
      data={items}
      getApiLink=""
      icon="trending-mints"
      onViewFrameClick={() => {}}
      onItemClick={() => {}}
      title="Most liked casts this week"
      viewAllLink=""
      renderItem={item => <Cast {...item} />}
    />
  );
}
