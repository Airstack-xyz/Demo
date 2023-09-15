import React from 'react';
import { SocialInfo } from '../../../utils/activeSocialInfoString';
import { useQuery } from '@airstack/airstack-react';
import { socialDetailsQuery } from '../../../queries/socialDetails';
import { Social } from './types';
import { Card, CardLoader } from './Card';

type DetailsSectionProps = {
  identities: string[];
  socialInfo: SocialInfo;
};

export function DetailsSection({
  identities,
  socialInfo
}: DetailsSectionProps) {
  const { data, loading } = useQuery(socialDetailsQuery, {
    identities,
    dappName: socialInfo.dappName
  });

  const socialItems: Social[] = data?.Socials?.Social;

  return (
    <div className="mt-2 flex">
      {!loading && socialItems?.map(item => <Card key={item.id} item={item} />)}
      {loading && <CardLoader />}
    </div>
  );
}
