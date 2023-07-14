import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { tokenOwnerQuery } from '../../../queries';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { TokenBalance } from '../../TokenBalances/types';
import { getDAppType } from '../utils';
import { Chain } from '@airstack/airstack-react/constants';
import { Modal } from '../../../Components/Modal';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { Header } from './Header';
import { ListWithMoreOptions } from './ListWithMoreOptions';
import { useNavigate } from 'react-router-dom';
import { Asset } from '../../../Components/Asset';

export function Token({
  token,
  onShowMore
}: {
  token: TokenBalance | null;
  onShowMore: (value: string[], dataType: string) => void;
}) {
  const walletAddress = token?.owner?.addresses || '';
  const tokenId = token?.tokenId || '';
  const tokenAddress = token?.tokenAddress || '';
  const primarEns = token?.owner?.primaryDomain?.name || '';
  const ens = token?.owner?.domains?.map(domain => domain.name) || [];

  const { lens, farcaster } = useMemo(() => {
    const social = token?.owner?.socials || [];
    const result = { lens: [], farcaster: [] };
    social.forEach(({ dappSlug, profileName }) => {
      const type = getDAppType(dappSlug);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const list = result[type];
      if (list) {
        list.push(profileName);
      }
    });
    return result;
  }, [token]);

  const getShowMoreHandler = useCallback(
    (items: string[], type: string) => () => {
      onShowMore(items, type);
    },
    [onShowMore]
  );

  return (
    <>
      <td className="!pl-9">
        <div className="token-img-wrapper w-[50px] h-[50px] rounded-md overflow-hidden [&>div]:w-full [&>div>img]:w-full">
          {tokenAddress && tokenId && (
            <Asset
              address={tokenAddress}
              tokenId={tokenId}
              preset="small"
              containerClassName="token-img"
              chain={token?.blockchain as Chain}
            />
          )}
        </div>
      </td>
      <td className="ellipsis">
        {/* <Link
          to={`/token-balances?address=${walletAddress}&rawInput=${walletAddress}`}
        > */}
        {walletAddress || '--'}
        {/* </Link> */}
      </td>
      <td className="ellipsis">{tokenId ? `#${tokenId}` : '--'}</td>
      <td className="ellipsis">{primarEns || '--'}</td>
      <td>
        <ListWithMoreOptions
          list={ens}
          onShowMore={getShowMoreHandler(ens, 'ens')}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={lens}
          onShowMore={getShowMoreHandler(lens, 'lens')}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={farcaster}
          onShowMore={getShowMoreHandler(farcaster, 'farcaster')}
        />
      </td>
      {/* <td>@</td> */}
    </>
  );
}

const loaderData = Array(6).fill({});

export function Tokens() {
  const [fetch, { data, loading }] =
    useLazyQueryWithPagination(tokenOwnerQuery);

  const { address: tokenAddress } = useSearchInput();
  const [showModal, setShowModal] = useState(false);
  const [modalValues, setModalValues] = useState<{
    leftValues: string[];
    rightValues: string[];
    dataType: string;
  }>({
    leftValues: [],
    rightValues: [],
    dataType: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (tokenAddress) {
      fetch({
        tokenAddress,
        limit: 200
      });
    }
  }, [fetch, tokenAddress]);

  const tokens = useMemo(() => {
    if (!data) return [];

    const ethTokenBalances: TokenBalance[] = data.ethereum?.TokenBalance || [];
    const polygonTokenBalances: TokenBalance[] =
      data.polygon?.TokenBalance || [];
    return [...ethTokenBalances, ...polygonTokenBalances];
  }, [data]);

  const handleShowMore = useCallback((values: string[], dataType: string) => {
    const leftValues: string[] = [];
    const rightValues: string[] = [];
    values.forEach((value, index) => {
      if (index % 2 === 0) {
        leftValues.push(value);
      } else {
        rightValues.push(value);
      }
    });
    setModalValues({
      leftValues,
      rightValues,
      dataType
    });
    setShowModal(true);
  }, []);

  const items: TokenBalance[] = loading ? loaderData : tokens;

  return (
    <div className="w-full border border-solid border-stroke-color rounded-2xl sm:overflow-hidden pb-5 overflow-y-auto">
      <table className="w-auto text-xs table-fixed sm:w-full">
        {!loading && <Header />}
        <tbody>
          {items.map((token, index) => (
            <tr
              key={index}
              className={classNames(
                '[&>td]:px-2 [&>td]:py-3 [&>td]:align-middle min-h-[54px] [&>td]:max-w-[200px] hover:bg-secondary cursor-pointer',
                {
                  'skeleton-loader': loading
                }
              )}
              data-loader-type="block"
              data-loader-margin="10"
              onClick={() => {
                const address = token?.owner?.addresses || '';
                if (address) {
                  navigate(
                    `/token-balances?address=${address}&rawInput=${address}`
                  );
                }
              }}
            >
              <Token token={token} onShowMore={handleShowMore} />
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        heading={`All ${modalValues.dataType} names of ${tokenAddress}`}
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
          setModalValues({
            leftValues: [],
            rightValues: [],
            dataType: ''
          });
        }}
      >
        <div className="w-[600px] max-h-[60vh] h-auto bg-primary rounded-xl p-5 overflow-auto flex">
          <div className="flex-1">
            {modalValues.leftValues.map((value, index) => (
              <div className="mb-8" key={index}>
                {value}
              </div>
            ))}
          </div>
          <div className="border-l border-solid border-stroke-color flex-1 pl-5">
            {modalValues.rightValues.map((value, index) => (
              <div className="mb-8" key={index}>
                {value}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
