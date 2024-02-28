import classNames from 'classnames';
import { useMatch } from 'react-router-dom';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { Search } from '../../Components/Search';
import { SortBy } from '../../Components/Filters/SortBy';
import { useLazyQuery } from '@airstack/airstack-react';
import { farcasterChannelQuery } from '../../queries/channels';
import {
  FarcasterChannelDetailsQuery,
  FarcasterChannelDetailsQueryVariables,
  OrderBy
} from '../../../__generated__/airstack-types';
import { useSearchInput } from '../../hooks/useSearchInput';
import { useEffect, useMemo } from 'react';
import { Overview } from './Overview';
import { Icon } from '../../Components/Icon';
import { ParticipentsList } from './Participents/Participents';
import { GetAPIDropdown } from '../../Components/GetAPIDropdown';
import { useCsvDownloadOptions } from '../../store/csvDownload';
import { ShareURLDropdown } from '../../Components/ShareURLDropdown';
import { useChannelApiOptions } from './useChannelApiOptions';

export function Channels() {
  const isHome = useMatch('/');
  const [inputs] = useSearchInput();
  const [fetchChannelDetails, { data, loading }] = useLazyQuery<
    FarcasterChannelDetailsQuery,
    FarcasterChannelDetailsQueryVariables
  >(farcasterChannelQuery);

  const channelId = inputs.address[0] || '';
  const orderBy = inputs.sortOrder === 'ASC' ? OrderBy.Asc : OrderBy.Desc;

  const [, setCsvDownloadOptions] = useCsvDownloadOptions(['options']);

  const getOptions = useChannelApiOptions();
  const optionsGetAPI = useMemo(() => getOptions(), [getOptions]);

  useEffect(() => {
    // todo add csv download options
    setCsvDownloadOptions({ options: [] });
  }, [optionsGetAPI, setCsvDownloadOptions]);

  useEffect(() => {
    if (channelId) {
      fetchChannelDetails({
        channelId
      });
    }
  }, [channelId, fetchChannelDetails]);

  const channelDetails = data?.FarcasterChannels?.FarcasterChannel?.[0];

  return (
    <div
      className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8', {
        'flex-1 h-full w-full flex flex-col !pt-[12vw] items-center text-center':
          isHome
      })}
    >
      <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
        {isHome && <h1 className="text-[2rem]">Explore web3 identities</h1>}
        <Search />
        {channelId && (
          <div>
            <div className="mt-3 flex items-center justify-between">
              <SortBy
                disabled={loading}
                descLabel="Newest action first"
                ascLabel="Olderst action first"
              />
              <div className="flex items-center">
                <GetAPIDropdown
                  options={optionsGetAPI}
                  dropdownAlignment="right"
                />
                <div className="ml-3.5">
                  <ShareURLDropdown dropdownAlignment="right" />
                </div>
              </div>
            </div>
            <section className="max-w-full overflow-hidden">
              <Overview
                channelDetails={channelDetails}
                loading={loading || !data}
              />
            </section>
            <section>
              <div className="flex mb-4">
                <Icon name="token-holders" height={20} width={20} />{' '}
                <span className="font-bold ml-1.5 text-sm text-text-secondary">
                  Participants
                </span>
              </div>
              <ParticipentsList
                channelId={loading ? '' : channelId}
                orderBy={orderBy}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
