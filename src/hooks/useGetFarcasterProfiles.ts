import { fetchQueryWithPagination } from '@airstack/airstack-react';
import { FaracsterProfilesQuery } from '../../__generated__/airstack-types';
import { farcasterProfilesQuery } from '@/queries/socials/farcasterProfiles';
import { useCallback, useRef, useState } from 'react';

const MAX_ITEMS = 200;

export type Profile = NonNullable<
  NonNullable<FaracsterProfilesQuery['Socials']>['Social']
>[0];

export function useGetFarcasterProfilesMap() {
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(loading);
  const [fidToProfileMap, setFidToProfileMap] = useState<
    Record<string, Profile>
  >({});

  loadingRef.current = loading;

  const fetchProfiles = useCallback(
    async (allFids: string[], onResponse: (socials: Profile[]) => void) => {
      setLoading(true);
      let index = 0;
      let fids = allFids.slice(index, MAX_ITEMS);

      while (fids.length > 0) {
        index++;
        const response = await fetchQueryWithPagination<FaracsterProfilesQuery>(
          farcasterProfilesQuery,
          {
            fids
          }
        );
        onResponse(response?.data?.Socials?.Social || []);
        const startIndex = MAX_ITEMS * index;
        const endIndex = startIndex + MAX_ITEMS;
        fids = fids.splice(startIndex, endIndex);
      }
      setLoading(false);
    },
    []
  );
  const fetch = useCallback(
    (fids: string[]) => {
      if (loadingRef.current) {
        return;
      }
      return fetchProfiles(fids, (socials: Profile[]) => {
        if (socials) {
          const fidMap: Record<string, Profile> = {};
          socials.forEach(social => {
            if (social.fid) {
              fidMap[social?.fid] = social;
            }
          });
          setFidToProfileMap(existingMap => ({ ...existingMap, ...fidMap }));
        }
      });
    },
    [fetchProfiles]
  );

  return [fetch, { data: fidToProfileMap, loading }] as const;
}
