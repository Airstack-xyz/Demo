import { useMemo, useState } from 'react';
import { useNavigate } from '@/hooks/useNavigate';
import { resetCachedUserInputs } from '../../../../hooks/useSearchInput';
import { createTokenBalancesUrl } from '../../../../utils/createTokenUrl';
import { isMobileDevice } from '../../../../utils/isMobileDevice';
import { CopyButton } from './CopyButton';
import { HoldersModal, HoldersModalProps } from './HoldersModal';

const MIN_OWNERS = 3;
const MAX_OWNERS = 7;

export function Owners({
  owners,
  token
}: {
  owners: string[];
  token: HoldersModalProps['token'];
}) {
  const [showModal, setShowModal] = useState(false);
  const [showMax, setShowMax] = useState(false);

  const navigate = useNavigate();

  const isMobile = isMobileDevice();

  const items = useMemo(() => {
    if (!showMax) {
      return owners?.slice(0, MIN_OWNERS);
    }
    return owners.slice(0, MAX_OWNERS);
  }, [showMax, owners]);

  const handleAddressClick = (address: string) => {
    const url = createTokenBalancesUrl({
      address,
      blockchain: '',
      inputType: 'ADDRESS',
      truncateLabel: isMobile
    });
    document.documentElement.scrollTo(0, 0);
    resetCachedUserInputs('tokenBalance');
    navigate(url);
  };

  return (
    <>
      <ul className="text-text-secondary overflow-hidden flex flex-col justify-center mr-1">
        {items?.map((owner, index) => (
          <li key={index} className="mb-2.5 last:mb-0 flex">
            <button
              className="mr-1 ellipsis border border-solid border-transparent hover:border-solid-stroke hover:bg-hover-secondry rounded-18"
              onClick={() => handleAddressClick(owner)}
            >
              {owner}
            </button>
            <CopyButton value={owner} />
          </li>
        ))}
        {!showMax && owners?.length > MIN_OWNERS && (
          <li
            onClick={() => {
              setShowMax(show => !show);
            }}
            className="text-text-button font-bold cursor-pointer"
          >
            see more
          </li>
        )}
        {showMax && owners.length > MAX_OWNERS && (
          <li
            onClick={() => {
              if (showMax && owners.length > MAX_OWNERS) {
                setShowModal(true);
              }
            }}
            className="text-text-button font-bold cursor-pointer"
          >
            see all
          </li>
        )}
      </ul>
      {showModal && (
        <HoldersModal
          heading="All Holders"
          token={token}
          isOpen={showModal}
          onAddressClick={handleAddressClick}
          onRequestClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
