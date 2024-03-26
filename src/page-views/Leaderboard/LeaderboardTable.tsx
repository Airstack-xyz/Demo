import { useEffect, useMemo } from 'react';
import { leadingProfileQuery } from '@/queries/leaderboard';
import {
  LeadingProfilesQuery,
  LeadingProfilesQueryVariables
} from '../../../__generated__/types';
import { useAppQuery } from '@/hooks/useAppQuery';
import {
  Profile,
  useGetFarcasterProfilesMap
} from '@/hooks/useGetFarcasterProfiles';
import LazyImage from '@/Components/LazyImage';
import classnames from 'classnames';
import { createTokenBalancesUrl } from '@/utils/createTokenUrl';
import { useNavigate } from '@/hooks/useNavigate';
import { noAllowedFarcasterIds } from './constants';

const loaderData = Array(6).fill({});

type ItemProps = {
  rank: number;
  profileImage: string;
  name: string;
  fid: string;
  swaps: number;
  referrals: number;
  totalPoints: number;
  profileHandle: string;
  onIdentityClick: (url: { pathname: string; search: string }) => void;
};

function toFixedPoints(eth: number) {
  if (!eth) {
    return 0;
  }
  const numString = eth.toFixed(4);
  // en-us locale only allows 3 decimal places, so we need to split the number and append the decimal places back to the whole number
  const [whole, decimal] = numString.split('.');
  const wholeNumberString = parseInt(whole).toLocaleString('en-US');
  return `${wholeNumberString}.${decimal}`;
}

function Td({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className="align-middle py-4 px-2.5">
      <div className={classnames('text-sm ellipsis', className)}>
        {children}
      </div>
    </td>
  );
}

function Item({
  rank,
  profileImage,
  name,
  fid,
  swaps,
  referrals,
  totalPoints,
  profileHandle,
  onIdentityClick
}: ItemProps) {
  const handleOpenUrl = () => {
    if (!profileHandle) return;

    const address = 'fc_fname:' + profileHandle;
    const url = createTokenBalancesUrl({
      address,
      blockchain: 'ethereum',
      inputType: 'ADDRESS'
    });
    onIdentityClick(url);
  };

  return (
    <>
      <Td className="px-2.5 py-2.5 pl-5">{rank}</Td>
      <Td>
        <LazyImage
          src={profileImage}
          className="rounded overflow-hidden size-14 object-cover"
        />
      </Td>
      <Td>
        <div
          className="hover:header-btn-bg cursor-pointer px-2 py-1 rounded-full overflow-hidden inline-block"
          onClick={handleOpenUrl}
        >
          {name}
        </div>
      </Td>
      <Td>
        <div
          className="hover:header-btn-bg cursor-pointer px-2 py-1 rounded-full inline-block"
          onClick={handleOpenUrl}
        >
          #{fid}
        </div>
      </Td>
      <Td>{toFixedPoints(swaps)}</Td>
      <Td>{toFixedPoints(referrals)}</Td>
      <Td>{toFixedPoints(totalPoints)}</Td>
    </>
  );
}

export function LeaderboardTable() {
  const navigate = useNavigate();
  const [
    fetchLeadingProfiles,
    { data: leadingProfiles, loading: loadingLeadingProfiles }
  ] = useAppQuery<LeadingProfilesQuery, LeadingProfilesQueryVariables>(
    leadingProfileQuery,
    false
  );

  useEffect(() => {
    fetchLeadingProfiles();
  }, [fetchLeadingProfiles]);

  const profiles = useMemo(() => {
    return (leadingProfiles?.LeadingProfiles?.leadingProfiles || []).filter(
      profile => !profile?.fid || !noAllowedFarcasterIds.has(profile?.fid)
    );
  }, [leadingProfiles]);

  const fids = useMemo(
    () =>
      profiles.map(profile => '' + profile?.fid).filter(Boolean) as string[],
    [profiles]
  );

  const [getFidToProfileMap, { data: fidToProfileMap }] =
    useGetFarcasterProfilesMap();

  useEffect(() => {
    if (fids.length > 0) {
      getFidToProfileMap(fids);
    }
  }, [getFidToProfileMap, fids]);

  const loading = loadingLeadingProfiles || !leadingProfiles;

  return (
    <div className="flex w-screen overflow-auto sm:w-auto sm:overflow-visible">
      <div className="bg-primary border border-solid border-[#10365E] rounded-lg py-3">
        <table className="table-fixed w-full max-w-[950px] border-spacing-10">
          {!loading && (
            <>
              <thead>
                <tr className="[&>th]:bg-token rounded-lg [&>th]:p-2.5 [&>th]:text-left text-xs font-bold">
                  <th className="!bg-transparent !p-0 w-24">
                    <div className="rounded-l-lg bg-token px-2.5 py-2.5 pl-5 ml-2">
                      #
                    </div>
                  </th>
                  <th className="w-32">Profile Image</th>
                  <th className="w-36 !pl-4">Name</th>
                  <th className="w-32 !pl-4">FID</th>
                  <th className="w-32">Swaps</th>
                  <th className="w-32">Referrals</th>
                  <th className="!bg-transparent !p-0 w-32">
                    <div className="rounded-r-lg bg-token p-2.5 mr-2">
                      Total Points
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((data, index) => {
                  const fid = data?.fid!;
                  const profile = fid
                    ? fidToProfileMap?.[fid] || ({} as Profile)
                    : ({} as Profile);

                  const image =
                    profile?.profileImageContentValue?.image?.medium ||
                    profile.profileImage;
                  return (
                    <tr key={index} className="even:bg-[#081e3280]">
                      <Item
                        profileHandle={profile?.profileHandle || ''}
                        key={index}
                        fid={`${fid || '--'}`}
                        name={profile?.profileName || '--'}
                        profileImage={image || ''}
                        rank={index + 1}
                        referrals={data?.referrerBonusPointEarnedFloat || 0}
                        swaps={data?.pointsEarnedFloat || 0}
                        totalPoints={data?.totalFloat || 0}
                        onIdentityClick={(urlInfo: {
                          pathname: string;
                          search: string;
                        }) => navigate(urlInfo)}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </>
          )}
          {loading && (
            <tbody>
              {loaderData.map((_, index) => {
                return (
                  <tr key={index} className="skeleton-loader">
                    <div data-loader-type="block" data-loader-margin="10">
                      <Item
                        fid=""
                        name=""
                        profileImage=""
                        rank={0}
                        referrals={0}
                        swaps={0}
                        totalPoints={0}
                        profileHandle=""
                        onIdentityClick={() => {}}
                      />
                    </div>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
