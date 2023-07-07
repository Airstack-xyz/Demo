import {
  useLazyQuery,
  useLazyQueryWithPagination
} from '@airstack/airstack-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { POAPQuery, SocialQuery } from '../../queries';
import { SectionHeader } from './SectionHeader';
import { PoapType, SocialsType } from './types';
import { Modal } from '../../Components/Modal';

type SocialType = SocialsType['Wallet'];
type SocialProps = {
  name: string;
  values: string[];
  onShowMore?: () => void;
};

const maxSocials = 7;
const minSocials = 5;

function Social({ name, values, onShowMore }: SocialProps) {
  const [showMax, setShowMax] = useState(false);
  const items = useMemo(() => {
    if (!showMax) {
      return values?.slice(0, minSocials);
    }
    return values?.slice(0, maxSocials);
  }, [showMax, values]);

  return (
    <div className="flex text-sm mb-7 last:mb-0">
      <div className="flex flex-1 items-start">
        <div className="flex items-center">
          <div className="rounded-full h-6 w-6 border border-solid border-stroke-color mr-2"></div>
          {name}
        </div>
      </div>
      <ul className="text-text-secondary w-1/2 overflow-hidden">
        {items?.map((value, index) => (
          <li
            key={index}
            className="overflow-ellipsis whitespace-nowrap overflow-hidden mb-2.5 last:mb-0"
          >
            {value}
          </li>
        ))}
        {values?.length > minSocials && (
          <>
            <li
              onClick={() => {
                setShowMax(show => !show);
              }}
              className="text-text-button font-bold cursor-pointer"
            >
              see {showMax ? 'less' : 'more'}
            </li>
            {showMax && values.length > maxSocials && (
              <li
                onClick={() => {
                  if (showMax && values.length > maxSocials) {
                    onShowMore?.();
                    return;
                  }
                }}
                className="text-text-button font-bold cursor-pointer"
              >
                see all
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
}

export function Socials({ owner = 'vitalik.eth' }: { owner?: string }) {
  const [modalValues, setModalValues] = useState<{
    leftValues: string[];
    rightValues: string[];
  }>({
    leftValues: [],
    rightValues: []
  });
  const [showModal, setShowModal] = useState(false);
  const [fetch, { data }] = useLazyQuery(SocialQuery);
  const socialDetails = (data?.Wallet || {}) as SocialType;

  useEffect(() => {
    if (owner) {
      fetch({
        identity: owner,
        blockchain: 'ethereum'
      });
    }
  }, [fetch, owner]);

  const domainsList = useMemo(
    () => socialDetails?.domains?.map(({ name }) => name),
    [socialDetails?.domains]
  );

  const handleShowMore = useCallback((values: string[]) => {
    const leftValues: string[] = [];
    const rightValues: string[] = [];
    values.forEach((value, index) => {
      if (index % 2 === 0) {
        leftValues.push(value);
      } else {
        rightValues.push(value);
      }
    });
    setModalValues({
      leftValues,
      rightValues
    });
    setShowModal(true);
  }, []);

  return (
    <div>
      <SectionHeader iconName="socials-flat" heading="Socials" />
      <div className="bg-secondary rounded-lg p-5 border border-solid border-stroke-color mt-3.5">
        <Social
          name="Primary ENS"
          values={[socialDetails?.primaryDomain?.name]}
        />
        <Social
          name="ENS names"
          values={domainsList || []}
          onShowMore={() => {
            handleShowMore(domainsList || []);
          }}
        />
        {socialDetails?.socials?.map(({ dappName, profileName }) => (
          <Social name={dappName} values={[profileName]} />
        ))}
      </div>
      <Modal
        heading="All ENS names of vitalik.eth"
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false);
          setModalValues({
            leftValues: [],
            rightValues: []
          });
        }}
      >
        <div className="w-[600px] max-h-[60vh] h-auto bg-primary rounded-xl p-5 overflow-auto flex">
          <div className="flex-1">
            {modalValues.leftValues.map((value, index) => (
              <div className="mb-8" key={index}>
                {value}
              </div>
            ))}
          </div>
          <div className="border-l border-solid border-stroke-color flex-1 pl-5">
            {modalValues.rightValues.map((value, index) => (
              <div className="mb-8" key={index}>
                {value}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
