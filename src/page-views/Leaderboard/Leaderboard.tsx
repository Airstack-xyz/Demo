import LazyImage from '@/Components/LazyImage';
import classnames from 'classnames';
import { FAQs } from './FAQs';
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
const loaderData = Array(6).fill({});

type ItemProps = {
  rank: number;
  profileImage: string;
  name: string;
  fid: string;
  swaps: number;
  referrals: number;
  totalPoints: number;
};

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
  totalPoints
}: ItemProps) {
  return (
    <>
      <Td className="px-2.5 py-2.5 pl-5">{rank}</Td>
      <Td>
        <LazyImage
          src={profileImage}
          className="rounded overflow-hidden size-14 object-cover"
        />
      </Td>
      <Td>{name}</Td>
      <Td>#{fid}</Td>
      <Td>{swaps}</Td>
      <Td>{referrals}</Td>
      <Td>{totalPoints}</Td>
    </>
  );
}

export default function Leaderboard() {
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

  const profiles = useMemo(
    () => leadingProfiles?.LeadingProfiles?.leadingProfiles || [],
    [leadingProfiles]
  );

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
  console.log({ fidToProfileMap });

  return (
    <div className="content px-5 sm:px-0">
      <h1 className="text-2xl sm:text-[40px] font-semibold mb-8 sm:mb-12 pt-5 sm:pt-7">
        Airstack Points Leaderboard
      </h1>
      <div className="flex flex-col sm:flex-row items-start">
        <div className="flex w-screen overflow-auto sm:w-auto sm:overflow-visible">
          <div className="bg-primary border border-solid border-[#10365E] rounded-lg pt-3">
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
                      <th className="w-36">Profile Image</th>
                      <th>Name</th>
                      <th className="w-32">FID</th>
                      <th className="w-32">Swaps</th>
                      <th className="w-32">Referrals</th>

                      <th className="!bg-transparent !p-0 w-32">
                        <div className="rounded-r-lg bg-token p-2.5 mr-2">
                          Total
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((data, index) => {
                      const profile = data?.fid
                        ? fidToProfileMap?.[data?.fid] || ({} as Profile)
                        : ({} as Profile);
                      const image =
                        profile.profileImage ||
                        profile?.profileImageContentValue?.image?.medium;
                      return (
                        <tr key={index} className="even:bg-[#081e3280]">
                          <Item
                            key={index}
                            fid={`${data?.fid || '--'}`}
                            name={profile?.profileName || '--'}
                            profileImage={image || ''}
                            rank={index + 1}
                            referrals={data?.referrerBonusPointEarnedFloat || 0}
                            swaps={data?.pointsEarnedFloat || 0}
                            totalPoints={data?.totalFloat || 0}
                          />
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              )}
              {loading && (
                <tbody>
                  {loaderData.map((item, index) => {
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
        <FAQs />
      </div>
    </div>
  );
}
