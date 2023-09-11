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
