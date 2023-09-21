import React, { memo, useEffect } from 'react';
import { useLazyQuery } from '@airstack/airstack-react';
import { socialDetailsQuery } from '../../../queries/socialDetails';
import { Social } from './types';
import { Card, CardLoader } from './Card';

type DetailsSectionProps = {
  identities: string[];
  profileNames: string[];
  dappName: string;
};

function DetailsSectionComponent({
  identities,
  profileNames,
  dappName
}: DetailsSectionProps) {
  const [fetchData, { data, loading }] = useLazyQuery(socialDetailsQuery);

  useEffect(() => {
    fetchData({
      identities,
      profileNames,
      dappName
    });
  }, [fetchData, profileNames, dappName, identities]);

  const socialItems: Social[] = data?.Socials?.Social;

  const isLensDapp = dappName === 'lens';

  return (
    <div className="my-5 mb-[30px] flex">
      {!loading &&
        socialItems?.map(item => (
          <Card key={item.id} item={item} isLensDapp={isLensDapp} />
        ))}
      {loading && <CardLoader isLensDapp={isLensDapp} />}
    </div>
  );
}

function arePropsEqual(
  prevProps: DetailsSectionProps,
  nextProps: DetailsSectionProps
) {
  return (
    prevProps.identities.join(',') === nextProps.identities.join(',') &&
    prevProps.profileNames.join(',') === nextProps.profileNames.join(',') &&
    prevProps.dappName === nextProps.dappName
  );
}

export const DetailsSection = memo(DetailsSectionComponent, arePropsEqual);
