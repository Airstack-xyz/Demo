import { useQuery } from '@airstack/airstack-react';
import { Fragment, useMemo } from 'react';
import { Icon } from '../../../Components/Icon';
import LazyImage from '../../../Components/LazyImage';
import { WalletAddress } from '../../../Components/WalletAddress';
import { domainDetailsQuery } from '../../../queries/domainDetails';
import { formatDate } from '../../../utils';
import { DomainType } from './types';
import { processRecords } from './utils';

const LOADING_ROW_COUNT = 10;

const loaderItems = Array(LOADING_ROW_COUNT).fill(0);

function DetailsLoader() {
  return (
    <div className="skeleton-loader flex max-sm:flex-col max-sm:items-center gap-6">
      <div
        data-loader-type="block"
        className="w-[180px] h-[180px] shrink-0 rounded-2xl"
      />
      <div className="w-full">
        <div data-loader-type="block" className="h-6 w-[300px]" />
        {loaderItems.map((_, index) => (
          <div
            key={index}
            data-loader-type="block"
            className="h-7 w-[500px] max-sm:w-full mt-4"
          />
        ))}
      </div>
    </div>
  );
}

type DomainDetailsResponse = {
  Domain: DomainType;
};

type DomainDetailsVariables = {
  name: string;
};

export function DetailsSection({ identity }: { identity: string }) {
  const { data, loading } = useQuery<
    DomainDetailsResponse,
    DomainDetailsVariables
  >(domainDetailsQuery, { name: identity });

  const domain = data?.Domain;

  const { primaryRecords, otherRecords } = useMemo(
    () => processRecords(domain?.texts || []),
    [domain]
  );

  if (loading) {
    return (
      <section className="bg-glass border-solid-stroke rounded-18 p-5">
        <DetailsLoader />
      </section>
    );
  }

  const tokenImageUrl =
    domain?.tokenNft?.contentValue?.image?.small || domain?.avatar;

  return (
    <section className="bg-glass border-solid-stroke rounded-18 p-5">
      <div className="flex max-sm:flex-col max-sm:items-center gap-6">
        <LazyImage
          alt="TokenImage"
          src={tokenImageUrl}
          height={180}
          width={180}
          className="object-cover rounded-2xl h-[180px] w-[180px] shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center">
            <img
              src="/images/ens.svg"
              height={24}
              width={24}
              className="rounded mr-2.5"
            />
            <div className="font-bold">{domain?.name}</div>
            {!!domain?.isPrimary && (
              <div className="flex items-center text-xs text-text-secondary ml-3">
                <Icon
                  name="check-mark-circle"
                  className="mr-1"
                  height={12}
                  width={12}
                />
                Primary ENS
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-[auto_1fr] [&>div:nth-child(even)]:text-text-secondary gap-x-4 gap-y-3 text-sm">
            {primaryRecords.map(item => (
              <Fragment key={item.key}>
                <div>{item.key}</div>
                <div>{item.value}</div>
              </Fragment>
            ))}
            {!!domain?.multiChainAddresses?.length && (
              <>
                <div className="font-semibold">Multi-chain addresses</div>
                <div />
                {domain?.multiChainAddresses.map(item => (
                  <Fragment key={item.address}>
                    <div className="self-center ml-7">{item.symbol}</div>
                    <WalletAddress
                      address={item.address}
                      className="max-w-fit ellipsis"
                    />
                  </Fragment>
                ))}
              </>
            )}
            {!!domain?.avatar && (
              <>
                <div className="self-center">Avatar</div>
                <WalletAddress
                  address={domain.avatar}
                  className="max-w-[448px] ellipsis"
                />
              </>
            )}
            {!!domain?.manager && (
              <>
                <div>Manager</div>
                <div className="ellipsis">{domain.manager}</div>
              </>
            )}
            {!!domain?.owner && (
              <>
                <div>Owner</div>
                <div className="ellipsis">{domain.owner}</div>
              </>
            )}
            {otherRecords.map(item => (
              <Fragment key={item.key}>
                <div>{item.key}</div>
                <div>{item.value}</div>
              </Fragment>
            ))}
            <div>Created At</div>
            <div>
              {domain?.createdAtBlockTimestamp
                ? formatDate(domain.createdAtBlockTimestamp)
                : '--'}
            </div>
            <div>Expiry date</div>
            <div>
              {domain?.expiryTimestamp
                ? formatDate(domain.expiryTimestamp)
                : '--'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
