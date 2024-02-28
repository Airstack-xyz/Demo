import { fetchQueryWithPagination } from '@airstack/airstack-react';
import { participantsSocialsQuery } from '../../../queries/channels';
import { ParticipantsSocialsQuery } from '../../../../__generated__/airstack-types';
import { useCallback, useState } from 'react';
import { ParticipentType, Social } from './types';

const MAX_INPUT_LIMIT = 200;
const MAX_RETRY_COUNT = 3;

async function waitFor(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPageWithRetry<T extends () => Promise<any>>(
  getNextPage: T,
  retryCount = 0
): Promise<Awaited<ReturnType<T>>> {
  if (retryCount > 0) {
    await waitFor(1000 * retryCount);
  }
  const response = await getNextPage();
  if (!response || response?.error) {
    if (retryCount < MAX_RETRY_COUNT) {
      return getPageWithRetry(getNextPage, retryCount + 1);
    }
    throw new Error('Error fetching data');
  }
  return response;
}

function mergeSocials(social: Social, existing: Social): Social {
  const { userAddressDetails } = social;
  const { userAddressDetails: existingUserAddressDetails } = existing;
  const addresses = [
    ...(existingUserAddressDetails?.addresses || []),
    ...(userAddressDetails?.addresses || [])
  ].filter((value, _, self) => self.indexOf(value) !== -1);

  const domains = [
    ...(existingUserAddressDetails?.domains || []),
    ...(userAddressDetails?.domains || [])
  ].filter((value, _, self) => !self.some(item => item.name === value.name));

  const socials = [
    ...(existingUserAddressDetails?.socials || []),
    ...(userAddressDetails?.socials || [])
  ].filter(
    (value, _, self) =>
      !self.findIndex(item => item.dappName === value.dappName)
  );

  return {
    __typename: social.__typename,
    userAddressDetails: {
      identity: userAddressDetails?.identity,
      addresses,
      domains,
      socials,
      primaryDomain:
        userAddressDetails?.primaryDomain ||
        existingUserAddressDetails?.primaryDomain ||
        null
    }
  };
}

function handleResponse(
  data: ParticipantsSocialsQuery | null,
  addressesToIgnore: string[] = [],
  values: Record<string, Social>,
  keys: string[]
) {
  const socials = (data?.Socials?.Social || []).filter(social => {
    return (
      !social?.userAddressDetails?.identity ||
      !addressesToIgnore.includes(social?.userAddressDetails?.identity)
    );
  });

  socials.forEach(social => {
    const key = keys.find(key =>
      key.includes(social?.userAddressDetails?.identity)
    );
    if (!key) return;
    if (key in values) {
      values[key] = mergeSocials(social, values[key]);
    } else {
      values[key] = social;
    }
  });
}

export async function resolve(
  address: string[],
  addressesToIgnore: string[] = [],
  keys: string[] = []
): Promise<Social[]> {
  const keyValue: Record<string, Social> = {};

  const { data, error, ...res } = await getPageWithRetry(() =>
    fetchQueryWithPagination<ParticipantsSocialsQuery>(
      participantsSocialsQuery,
      {
        identities: address
      }
    )
  );

  if (data && !error) {
    handleResponse(data, addressesToIgnore, keyValue, keys);
  }

  let pagination = res;
  while (pagination.hasNextPage) {
    const response = await getPageWithRetry(pagination.getNextPage);
    if (response) {
      const { data, error, ...res } = response;
      if (data && !error) {
        handleResponse(data, addressesToIgnore, keyValue, keys);
      }
      pagination = res;
    }
  }

  return keys.map(key => keyValue[key]);
}

export async function resolveSocials(
  allAddress: string[][],
  addressesToIgnore: string[] = []
) {
  const addressList = allAddress.flat();
  const keys = allAddress.map(address => address.join('_'));
  const address = addressList.filter(
    address => !addressesToIgnore.includes(address)
  );

  const resolved: Social[] = [];

  for (let i = 0; i < address.length; i += MAX_INPUT_LIMIT) {
    const batch = address.slice(i, i + MAX_INPUT_LIMIT);
    await resolve(batch, addressesToIgnore, keys).then(resolvedSocials => {
      resolvedSocials.forEach(social => {
        resolved.push(social);
      });
    });
  }
  return resolved;
}

export function useResolveUserDetails() {
  const [resolved, setResolved] = useState<ParticipentType[]>([]);
  const [loading, setLoading] = useState(false);
  const resolver = useCallback(async (participants: ParticipentType[]) => {
    setLoading(true);
    const addressToIgnore: string[] = [];
    const addressToResolve: string[][] = [];
    participants.forEach(participant => {
      addressToIgnore.push(participant.participant?.userAddress || '');
      addressToResolve.push(
        participant.participant?.userAssociatedAddresses || []
      );
    });
    const resolvedSocials = await resolveSocials(
      addressToResolve,
      addressToIgnore
    );
    setLoading(false);
    const resolvedParticipants = participants.map((participant, index) => {
      const resolvedSocial = resolvedSocials[index];
      return {
        ...participant,
        participant: {
          ...participant.participant,
          userAddressDetails: {
            ...participant.participant?.userAddressDetails,
            ...(resolvedSocial ? { ...resolvedSocial.userAddressDetails } : {})
          }
        }
      };
    });
    setResolved(resolvedParticipants as ParticipentType[]);
    return resolvedParticipants;
  }, []);
  return {
    resolve: resolver,
    resolved,
    loading
  };
}
