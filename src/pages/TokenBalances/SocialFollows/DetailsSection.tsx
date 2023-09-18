import React, { memo } from 'react';
import { useQuery } from '@airstack/airstack-react';
import { socialDetailsQuery } from '../../../queries/socialDetails';
import { Social } from './types';
import { Card, CardLoader } from './Card';

type DetailsSectionProps = {
  identities: string[];
  dappName: string;
};

function DetailsSectionComponent({
  identities,
  dappName
}: DetailsSectionProps) {
  const { data, loading } = useQuery(socialDetailsQuery, {
    identities,
    dappName
  });

  const socialItems: Social[] = data?.Socials?.Social;

  return (
    <div className="mt-2 flex">
      {!loading && socialItems?.map(item => <Card key={item.id} item={item} />)}
      {loading && <CardLoader />}
    </div>
  );
}

function arePropsEqual(
  prevProps: DetailsSectionProps,
  nextProps: DetailsSectionProps
) {
  return (
    prevProps.identities.join(',') === nextProps.identities.join(',') &&
    prevProps.dappName === nextProps.dappName
  );
}

export const DetailsSection = memo(DetailsSectionComponent, arePropsEqual);
