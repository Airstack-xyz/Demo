import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { useState, useEffect } from 'react';
import { POAPQuery } from '../../queries';
import { SectionHeader } from './SectionHeader';
import { PoapType } from './types';
import { formatDate } from '../../utils';

function Poap({
  eventName,
  startDate
}: PoapType['Poaps']['Poap'][0]['poapEvent']) {
  return (
    <div className="flex rounded-lg glass-effect border border-solid border-stroke-color mb-5 overflow-hidden">
      <div className="h-36 w-36">
        <img src="images/temp-poap.png" />
      </div>
      <div className="flex flex-1 flex-col justify-center p-4 glass-effect min-w-0">
        <div className="font-semibold overflow-ellipsis whitespace-nowrap overflow-hidden">
          {eventName}
        </div>
        <div className="text-sm text-text-secondary mt-1.5">
          {formatDate(startDate)}
        </div>
        <div className="text-sm text-text-secondary mt-1.5">City, Country</div>
      </div>
    </div>
  );
}

export function Poaps({ owner = 'vitalik.eth' }: { owner?: string }) {
  const [poaps, setPoaps] = useState<PoapType['Poaps']['Poap']>([]);

  const [fetch, { data }] = useLazyQueryWithPagination(POAPQuery);

  useEffect(() => {
    if (owner) {
      fetch({
        owner,
        limit: 20
      });
      setPoaps([]);
    }
  }, [fetch, owner]);

  useEffect(() => {
    if (data) {
      setPoaps(poaps => [...poaps, ...(data?.Poaps?.Poap || [])]);
    }
  }, [data]);

  // const handleNext = useCallback(() => {
  //   pagination?.getNextPage();
  // }, [pagination]);

  // const dataNotFound = !error && !loading && poaps.length === 0;
  // console.log('poaps', poaps);
  return (
    <div className="mt-11">
      <SectionHeader iconName="poap-flat" heading="POAPs" />
      <div className="mt-3.5">
        {poaps.map((poap, index) => (
          <Poap key={index} {...poap.poapEvent} />
        ))}
      </div>
    </div>
  );
}
