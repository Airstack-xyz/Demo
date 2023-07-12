import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Modal } from '../../Components/Modal';
import { Search } from '../../Components/Search';
import { Layout } from '../../Components/layout';
import { tokenOwnerQuery, tokensQuery } from '../../queries';
import { Tokens } from './Tokens';
import classNames from 'classnames';
import { Asset, useLazyQueryWithPagination } from '@airstack/airstack-react';
import { TokenBalance, Social } from '../TokenBalances/types';
import { getDAppType } from './utils';
import { useSearchInput } from '../../hooks/useSearchInput';

function HolderCount({
  count,
  subText,
  image
}: {
  count: number;
  subText: string;
  image?: ReactNode;
}) {
  return (
    <div
      className="px-3 py-5 flex items-center rounded-xl bg-tertiary"
      data-loader-type="block"
      data-loader-height="auto"
    >
      <div className="rounded-full w-[47px] h-[47px] overflow-hidden flex-col-center">
        {image}
      </div>
      <div className="pl-2.5">
        <div className="text-xl font-bold">{count}</div>
        <div className="text-text-secondary text-xs">{subText}</div>
      </div>
    </div>
  );
}

const LIMIT = 200;

const imageAndSubTextMap: Record<
  string,
  {
    image?: string;
    subText: string;
  }
> = {
  totalOwners: {
    subText: 'owns'
  },
  ownerWithLens: {
    image: '/images/lens.svg',
    subText: 'have Lens profiles'
  },
  ownerWithFarcaster: {
    image: '/images/farcaster.svg',
    subText: 'have Farcaster profiles'
  },
  ownerWithENS: {
    image: '/images/ens.svg',
    subText: 'have ENS names'
  },
  ownerWithPrimaryENS: {
    image: '/images/ens.svg',
    subText: 'have Primary ENS'
  }
};
function HoldersOverview() {
  const [overViewData, setOverViewData] = useState({
    totalOwners: 0,
    ownerWithENS: 0,
    ownerWithPrimaryENS: 0,
    ownerWithLens: 0,
    ownerWithFarcaster: 0
  });
  const holdersSetRef = useRef(new Set<string>());
  const overViewDataRef = useRef({
    totalOwners: 0,
    ownerWithENS: 0,
    ownerWithPrimaryENS: 0,
    ownerWithLens: 0,
    ownerWithFarcaster: 0
  });
  const [fetch, { data, loading, pagination }] =
    useLazyQueryWithPagination(tokenOwnerQuery);
  const [tokenDetails, setTokenDetails] = useState<null | {
    name: string;
    tokenId: string;
    tokenAddress: string;
  } | null>(null);

  const { query: tokenAddress } = useSearchInput();

  useEffect(() => {
    if (tokenAddress) {
      fetch({
        tokenAddress,
        limit: LIMIT
      });
    }
  }, [fetch, tokenAddress]);

  const updateCount = useCallback((tokenBalances: TokenBalance[]) => {
    let {
      totalOwners,
      ownerWithENS,
      ownerWithPrimaryENS,
      ownerWithLens,
      ownerWithFarcaster
    } = overViewDataRef.current;

    tokenBalances.forEach(({ owner }) => {
      if (!holdersSetRef.current.has(owner.identity)) {
        totalOwners++;
      } else {
        return;
      }

      holdersSetRef.current.add(owner.identity);

      if (owner.primaryDomain) {
        ownerWithPrimaryENS++;
      }
      if (owner.domains && owner.domains.length > 0) {
        ownerWithENS++;
      }
      owner?.socials?.forEach((social: Social) => {
        const type = getDAppType(social.dappSlug);
        if (type === 'lens') {
          ownerWithLens++;
        }
        if (type === 'farcaster') {
          ownerWithFarcaster++;
        }
      });
    });

    overViewDataRef.current = {
      totalOwners,
      ownerWithENS,
      ownerWithPrimaryENS,
      ownerWithLens,
      ownerWithFarcaster
    };
  }, []);

  useEffect(() => {
    if (data) {
      const ethTokenBalances: TokenBalance[] = data.ethereum.TokenBalance;
      const polygonTokenBalances: TokenBalance[] = data.polygon.TokenBalance;

      setTokenDetails(tokenDetails => {
        if (tokenDetails) return tokenDetails;
        return {
          name: ethTokenBalances[0].token.name,
          tokenId: ethTokenBalances[0].tokenId,
          tokenAddress: ethTokenBalances[0].tokenAddress
        };
      });

      updateCount(ethTokenBalances);
      updateCount(polygonTokenBalances);
      // load next page if available
      if (pagination.hasNextPage) {
        pagination.getNextPage();
      }
    }
  }, [data, pagination, updateCount]);

  useEffect(() => {
    if (!pagination.hasNextPage) {
      setOverViewData(overViewDataRef.current);
    }
  }, [pagination.hasNextPage]);

  const tokenImage = useMemo(() => {
    if (!tokenDetails) return null;
    const { tokenId, tokenAddress } = tokenDetails;
    return <Asset address={tokenAddress} tokenId={tokenId} preset="medium" />;
  }, [tokenDetails]);

  const holderCounts = useMemo(() => {
    return Object.keys(overViewData).map(key => {
      const { image, subText: text } = imageAndSubTextMap[key];
      let subText = text;
      if (key === 'totalOwners' && tokenDetails) {
        subText += ` ${tokenDetails.name}`;
      }
      return (
        <HolderCount
          key={key}
          count={overViewData[key as keyof typeof overViewData]}
          subText={subText}
          image={
            !image ? tokenImage : <img src={image} alt="" className="w-full" />
          }
        />
      );
    });
  }, [overViewData, tokenDetails, tokenImage]);

  const totalHolders = overViewData?.totalOwners || 0;

  return (
    <div
      className={classNames(
        'flex w-full glass-effect rounded-lg overflow-hidden h-[421px]',
        {
          'skeleton-loader': loading
        }
      )}
    >
      <div
        className="border border-solid border-stroke-color bg-secondary rounded-lg p-5 m-2.5 flex-1 w-full"
        data-loader-type="block"
        data-loader-height="auto"
      >
        <h3 className="text-2xl mb-2"> {totalHolders} holders</h3>
        <div className="border-t-2 border-solid border-stroke-color"></div>
        <div className="grid grid-cols-2 gap-2.5 mt-5">{holderCounts}</div>
      </div>
      <div
        className="h-full flex-1 hidden sm:block [&>div]:h-full [&>div]:w-full [&>div>img]:w-full"
        data-loader-type="block"
      >
        {tokenImage}
      </div>
    </div>
  );
}

export function TokenHolders() {
  const [showModal, setShowModal] = useState(false);
  return (
    <Layout>
      <div className="flex flex-col mx-14 px-2 pt-5 w-[955px] max-w-[100vw] sm:pt-14">
        <div className="flex flex-col items-center">
          <Search />
        </div>
        <div className="flex flex-col justify-center mt-7">
          <HoldersOverview />
          <div className="mt-10">
            <Tokens />
          </div>
        </div>
      </div>
      <Modal
        heading="Get API"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <pre className="w-[600px] max-h-[60vh] h-auto code rounded-xl p-5 overflow-auto">
          {tokensQuery}
        </pre>
        <button className="bg-button-primary hover:bg-button-primary-hover mt-5 w-full py-4 font-bold rounded-md">
          Copy
        </button>
      </Modal>
    </Layout>
  );
}
