import { useMemo } from 'react';
import { useSearchInput } from '../../../hooks/useSearchInput';
import { TokenDetails } from '../../TokenBalances/ERC6551/TokenDetails';
import { TokenDetailsReset } from '../../../store/tokenDetails';
import { getAllActiveTokenInfo } from '../../../utils/activeTokenInfoString';

export function Details() {
  const [{ activeTokenInfo }, setSearchInput] = useSearchInput();

  const activeTokens = useMemo(() => {
    return getAllActiveTokenInfo(activeTokenInfo);
  }, [activeTokenInfo]);

  return (
    <TokenDetailsReset>
      <TokenDetails
        activeTokens={activeTokens}
        onClose={() => {
          setSearchInput({
            activeTokenInfo: ''
          });
        }}
      />
    </TokenDetailsReset>
  );
}
