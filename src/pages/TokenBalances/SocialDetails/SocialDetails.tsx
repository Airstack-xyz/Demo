import { useLazyQuery } from '@airstack/airstack-react';
import { useEffect, useMemo } from 'react';
import { Icon } from '../../../Components/Icon';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { socialDetailsQuery } from '../../../queries/socialDetails';
import { getActiveSocialInfo } from '../../../utils/activeSocialInfoString';
import { Social } from './types';
import { SocialCard } from './SocialCard';

export function SocialDetails() {
  const [{ address, activeSocialInfo }, setData] = useSearchInput();

  const social = useMemo(
    () => getActiveSocialInfo(activeSocialInfo),
    [activeSocialInfo]
  );

  const [fetchDetails, { data: detailsData, loading: detailsLoading }] =
    useLazyQuery(socialDetailsQuery, {
      identities: address,
      dappSlug: social.dappSlug
    });

  const handleClose = () => {
    setData(
      {
        activeSocialInfo: undefined
      },
      { updateQueryParams: true }
    );
  };

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const socialDetailList: Social[] = detailsData?.Socials?.Social;

  return (
    <div className="max-w-[950px] text-sm m-auto w-[98vw] pt-10 sm:pt-0">
      <div className="flex items-center mb-7">
        <div className="flex items-center max-w-[60%] sm:w-auto overflow-hidden mr-1">
          <div
            className="flex items-center cursor-pointer hover:bg-glass-1 px-2 py-1 rounded-full overflow-hidden"
            onClick={handleClose}
          >
            <Icon name="token-balances" height={20} width={20} />
            <span className="ml-1.5 text-text-secondary break-all cursor-pointer max-w-[90%] sm:max-w-[500px] ellipsis">
              Token balances of {address.join(', ')}
            </span>
          </div>
          <span className="mr-2 text-text-secondary">/</span>
        </div>
        <div className="flex items-center flex-1">
          <Icon name="table-view" height={20} width={20} className="mr-2" />
          <span className="text-text-primary">
            <span className="capitalize">{social.dappName}</span> details
          </span>
        </div>
      </div>
      <div className="mt-2 flex">
        {!detailsLoading &&
          socialDetailList?.map(item => (
            <SocialCard key={item.id} social={item} />
          ))}
      </div>
    </div>
  );
}
