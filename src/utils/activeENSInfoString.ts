export const getActiveENSInfoString = ({ identity }: { identity: string }) => {
  return `${identity || ''}`;
};

export function getActiveENSInfo(activeENSInfo?: string) {
  const [identity] = activeENSInfo?.split('│') ?? [];

  return {
    isApplicable: Boolean(identity),
    identity
  };
}

export type ENSInfo = ReturnType<typeof getActiveENSInfo>;
