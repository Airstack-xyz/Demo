import { InputWithMention } from '@/Components/Input/Input';
import {
  getAllMentionDetails,
  getAllWordsAndMentions
} from '@/Components/Input/utils';
import { addAndRemoveCustomCombinationPlaceholder } from '@/Components/Search/utils';
import { ValidateAddressResponse } from '@/app/api/frame/validate-address/route';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { showToast } from '@/utils/showToast';
import { useCallback, useEffect, useMemo, useState } from 'react';

const CONTRACT_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const MAX_TOKENS = 2;

const swappableTokensSet = new Set<string>([]);

function isAddressesSwapable(
  address: string
): Promise<ValidateAddressResponse> {
  const res = fetch(`/api/frame/validate-address`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tokenAddress: address })
  }).then(res => res.json());
  console.log({ res });
  return res;
}

export function AddressInput({
  onSubmit
}: {
  onSubmit: (adresses: string[]) => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const [validatingToken, setValidatingToken] = useState(false);
  const [value, setValue] = useState('');

  const ref = useOutsideClick<HTMLDivElement>(() => {
    if (!validatingToken) {
      setShowHint(false);
    }
  });

  const onChange = useCallback((value: string) => {
    setValue(value);
    setShowHint(value.length > 3);
  }, []);

  const validateTokenForSwap = useCallback(async (address: string) => {
    const exists = swappableTokensSet.has(address);
    if (exists) {
      return true;
    }
    const res = await isAddressesSwapable(address);
    if (res.error === 'INVALID_REQUEST') {
      showToast('Please enter a valid token address', 'negative');
    }

    if (res.error === 'SERVER_ERROR') {
      showToast('Unable to validate the token please try later', 'negative');
    }

    if (res.error === 'VALIDATION_ERROR') {
      showToast(
        'the entered token is not supported by 0x for swaps yet',
        'negative'
      );
      return false;
    }

    return Boolean(res.data?.isValid);
  }, []);

  const handleSubmit = useCallback(
    async (value: string) => {
      const words = getAllWordsAndMentions(value);
      const mentionWithAddress = words.filter(
        word => CONTRACT_ADDRESS_REGEX.test(word.word) || word.mention
      );

      if (
        mentionWithAddress.length === 0 ||
        mentionWithAddress.length !== words.length
      ) {
        showToast('Please enter a valid token address', 'negative');
        setShowHint(false);
        onSubmit([]);
        return;
      }

      if (mentionWithAddress.length > MAX_TOKENS) {
        showToast('You can only enter 2 tokens', 'negative');
        const rawInput = mentionWithAddress
          .filter(mention => mention.mention)
          .slice(0, 2);

        setValue(
          rawInput
            .map(mention => {
              return mention.rawValue;
            })
            .join(' ')
        );

        onSubmit(
          rawInput.map(mention => mention.mention?.address || mention.word)
        );
        setShowHint(false);
        return;
      }

      setValidatingToken(true);
      const addresses = mentionWithAddress.map(mention =>
        validateTokenForSwap(mention.mention?.address || mention.word)
      );

      const res = await Promise.all(addresses);
      let highlightedValue = '';
      const validTokens: string[] = [];

      res.forEach((isValid, i) => {
        if (isValid) {
          highlightedValue += mentionWithAddress[i].rawValue + ' ';
          validTokens.push(
            mentionWithAddress[i].mention?.address || mentionWithAddress[i].word
          );
        }
      });

      setValue(
        highlightedValue.length < 3 ? highlightedValue.trim() : highlightedValue
      );
      onSubmit(validTokens);
      setShowHint(false);
      setValidatingToken(false);
    },
    [onSubmit, validateTokenForSwap]
  );

  const shouldShowCombinationPlaceholder = useMemo(() => {
    const [mentions] = getAllMentionDetails(value);
    return mentions.length === 1;
  }, [value]);

  useEffect(() => {
    return addAndRemoveCustomCombinationPlaceholder(
      shouldShowCombinationPlaceholder,
      '+ add a 2nd contract'
    );
  }, [shouldShowCombinationPlaceholder]);

  return (
    <div
      id="frame-token-input-wrapper"
      className="relative h-9 border border-solid border-[#10365E] bg-[#081C2E] rounded-full px-3 text-xs"
      ref={ref}
    >
      <InputWithMention
        disableSuggestions
        placeholder="0x enter contract address"
        value={value}
        onChange={onChange}
        onSubmit={handleSubmit}
        disabled={validatingToken}
      />
      {showHint && (
        <div className="absolute left-0 top-full mt-2 rounded-18 w-full py-5 flex-col-center border border-solid border-[#10365E] bg-[#142738] z-10">
          <div>
            {validatingToken
              ? 'Validating token address...'
              : "Press 'Enter' to submit a contract address"}
          </div>
        </div>
      )}
    </div>
  );
}
