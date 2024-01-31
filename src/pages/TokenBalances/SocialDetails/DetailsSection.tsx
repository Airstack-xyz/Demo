import { useQuery } from '@airstack/airstack-react';
import { memo } from 'react';
import { socialDetailsQuery } from '../../../queries/socialDetails';
import { Card, CardLoader } from './Card';
import { Social } from './types';

type SocialDetailsResponse = {
  Socials: {
    Social: Social[];
  };
};

type SocialDetailsVariables = {
  identities: string[];
  profileNames: string[];
  dappName: string;
};

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
  const { data, loading } = useQuery<
    SocialDetailsResponse,
    SocialDetailsVariables
  >(socialDetailsQuery, {
    identities,
    profileNames,
    dappName
  });

  const socialItems = data?.Socials?.Social;

  const isLensDapp = dappName === 'lens';

  if (loading) {
    return (
      <div className="my-5 mb-[30px] flex">
        <CardLoader isLensDapp={isLensDapp} />
      </div>
    );
  }

  return (
    <div className="my-5 mb-[30px] flex">
      {socialItems?.map(item => (
        <Card key={item.id} item={item} isLensDapp={isLensDapp} />
      ))}
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
