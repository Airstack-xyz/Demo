import classNames from 'classnames';
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
import { CSVDownloadDropdown } from '../../Components/CSVDownload/CSVDownloadDropdown';
import { CSVDownloadOption } from '../../types';
import { CsvQueryType } from '../../../__generated__/types';
import { useMatch } from '@/hooks/useMatch';

export function Channels() {
  const isHome = useMatch('/');
  const [inputs] = useSearchInput();
  const [fetchChannelDetails, { data, loading }] = useLazyQuery<
    FarcasterChannelDetailsQuery,
    FarcasterChannelDetailsQueryVariables
  >(farcasterChannelQuery);

  const channelId = inputs.address[0] || '';
  const orderBy = inputs.sortOrder === 'ASC' ? OrderBy.Asc : OrderBy.Desc;
  const channelDetails = data?.FarcasterChannels?.FarcasterChannel?.[0];
  const channelName = channelDetails?.name || channelId;

  const [, setCsvDownloadOptions] = useCsvDownloadOptions(['options']);

  const getOptions = useChannelApiOptions();
  const optionsGetAPI = useMemo(() => getOptions(), [getOptions]);

  const csvOptions: CSVDownloadOption[] = useMemo(() => {
    const name = `Participants of ${channelName || 'Channel'}`;
    return [
      {
        label: name,
        key: CsvQueryType.FarcasterChannelParticipants,
        fileName: name,
        variables: {
          channelId,
          orderBy
        }
      }
    ];
  }, [channelId, channelName, orderBy]);

  useEffect(() => {
    // todo add csv download options
    setCsvDownloadOptions({ options: csvOptions });
  }, [csvOptions, optionsGetAPI, setCsvDownloadOptions]);

  useEffect(() => {
    if (channelId) {
      fetchChannelDetails({
        channelId
      });
    }
  }, [channelId, fetchChannelDetails]);

  return (
    <div
      className={classNames('content ', {
        'flex-1 h-full w-full flex flex-col !pt-[12vw] items-center text-center':
          isHome
      })}
    >
      <div className="main-section">
        {isHome && <h1 className="text-[2rem]">Explore web3 identities</h1>}
        <div style={{ maxWidth: MAX_SEARCH_WIDTH }}>
          <Search />
        </div>
        {channelId && (
          <div>
            <div
              className="mt-3 flex items-center justify-between"
              style={{ maxWidth: MAX_SEARCH_WIDTH }}
            >
              <SortBy
                disabled={loading}
                descLabel="Newest action first"
                ascLabel="Oldest action first"
              />
              <div className="flex items-center">
                <GetAPIDropdown
                  disabled={loading}
                  options={optionsGetAPI}
                  dropdownAlignment="right"
                />
                <div className="ml-3.5">
                  <CSVDownloadDropdown
                    options={csvOptions}
                    disabled={loading}
                  />
                </div>
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
