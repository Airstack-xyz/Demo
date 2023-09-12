export const getActiveSocialInfoString = ({
  dappName,
  dappSlug,
  activeTab
}: {
  dappName: string;
  dappSlug: string;
  activeTab?: string;
}) => {
  return `${dappName} ${dappSlug} ${activeTab || ''}`;
};

export const getActiveSocialInfo = (activeSocialInfo?: string) => {
  const [dappName, dappSlug, activeTab] = activeSocialInfo?.split(' ') ?? [];

  return { isApplicable: Boolean(dappSlug), dappName, dappSlug, activeTab };
};
