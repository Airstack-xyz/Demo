import { useMemo } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { TokenDetails } from '../../TokenBalances/ERC6551/TokenDetails';

export function Details() {
  const [{ activeTokenInfo }, setSearchInput] = useSearchInput();

  const token = useMemo(() => {
    const [tokenAddress, tokenId, blockchain, eventId] =
      activeTokenInfo.split(' ');
    return {
      tokenAddress,
      tokenId,
      blockchain,
      eventId
    };
  }, [activeTokenInfo]);

  return (
    <TokenDetails
      tokenAddress={token.tokenAddress}
      tokenId={token.tokenId}
      blockchain={token.blockchain}
      eventId={token.eventId}
      onClose={() => {
        setSearchInput({
          activeTokenInfo: ''
        });
      }}
    />
  );
}
