import { Link, useNavigate } from 'react-router-dom';
import { createTokenBalancesUrl } from '../../../../utils/createTokenUrl';
import classNames from 'classnames';
import { useState, useMemo } from 'react';
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
  const navigator = useNavigate();
  const items = useMemo(() => {
    if (!showMax) {
      return owners?.slice(0, MIN_OWNERS);
    }
    return owners.slice(0, MAX_OWNERS);
  }, [showMax, owners]);

  return (
    <>
      <ul className="text-text-secondary overflow-hidden flex flex-col justify-center mr-1">
        {items?.map((owner, index) => (
          <li key={index} className={classNames('mb-2.5 last:mb-0 flex')}>
            <Link
              className="ellipsis border border-solid border-transparent hover:border-solid-stroke hover:bg-glass rounded-18"
              to={createTokenBalancesUrl({
                address: owner,
                blockchain: '',
                inputType: 'ADDRESS'
              })}
            >
              {owner}
            </Link>{' '}
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
          onAddressClick={(address: string) => {
            navigator(
              createTokenBalancesUrl({
                address,
                blockchain: '',
                inputType: 'ADDRESS'
              })
            );
          }}
          onRequestClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
