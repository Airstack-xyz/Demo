import { useMemo, useState } from 'react';
import {
  TokenHolder,
  useOverviewTokens
} from '../../../store/tokenHoldersOverview';
import { ToggleSwitch } from '../../ToggleSwitch';
import { FrameLabel } from '../FrameLabel';
import { FrameModal } from '../FrameModal';
import { FrameRenderer } from '../FrameRenderer';
import { FrameURL } from '../FrameURL';
import {
  ENCODED_BLOCKCHAIN,
  ENCODED_TOKEN_TYPE,
  FRAMES_ENDPOINT
} from '../constants';
import { encodeFrameData } from '../utils';

function ModalContent() {
  const [{ tokens: _overviewTokens }] = useOverviewTokens(['tokens']);

  const [isTokenImagePrimary, setIsTokenPrimaryImage] = useState(false);

  const isOverviewTokensLoading = _overviewTokens?.length === 0;

  const overviewToken: TokenHolder = _overviewTokens?.[0];

  const handleTokenPrimaryImageToggle = () => {
    setIsTokenPrimaryImage(prevValue => !prevValue);
  };

  const { frameUrl, postUrl } = useMemo(() => {
    if (!overviewToken) {
      return {
        frameUrl: '',
        postUrl: ''
      };
    }
    const params = {
      // Remove non-ascii letters, window.btoa throws error due this
      // eslint-disable-next-line no-control-regex
      n: overviewToken.name.replace(/[^\x00-\x7F]/g, ''),
      i: overviewToken?.image ? encodeURIComponent(overviewToken.image) : '',
      a: overviewToken.tokenAddress,
      t: ENCODED_TOKEN_TYPE[
        overviewToken.tokenType as keyof typeof ENCODED_TOKEN_TYPE
      ],
      b: ENCODED_BLOCKCHAIN[
        overviewToken.blockchain as keyof typeof ENCODED_BLOCKCHAIN
      ],
      p: isTokenImagePrimary ? '1' : '0'
    };
    const searchParams = new URLSearchParams(params);
    return {
      frameUrl: `${FRAMES_ENDPOINT}/th/${encodeFrameData(params)}`,
      postUrl: `${FRAMES_ENDPOINT}/th/frame?${searchParams.toString()}`
    };
  }, [isTokenImagePrimary, overviewToken]);

  return (
    <div className="py-1">
      <div className="text-white text-lg font-semibold">
        Showcase holders in a Frame
      </div>
      <div className="mt-4 gap-7">
        <FrameLabel
          label="Customize"
          labelIcon="customize"
          labelIconSize={16}
        />
        <ToggleSwitch
          label="Make primary image the NFT"
          labelClassName="text-sm"
          onClick={handleTokenPrimaryImageToggle}
          checked={isTokenImagePrimary}
        />
      </div>
      <div className="flex items-end max-sm:mt-8 mt-4 gap-6">
        <FrameURL
          containerClass="w-full"
          longUrl={frameUrl}
          showLoading={isOverviewTokensLoading}
        />
      </div>
      <div className="max-sm:mt-8 mt-4">
        <FrameLabel label="Preview" labelIcon="frame" labelIconSize={16} />
        <FrameRenderer
          postUrl={postUrl}
          showLoading={isOverviewTokensLoading}
          frameContainerClass="bg-gradient-to-b from-[#122230] to-[#051523]"
        />
      </div>
    </div>
  );
}

export function TokenHoldersFrameModal({ disabled }: { disabled?: boolean }) {
  return (
    <FrameModal disabled={disabled}>
      <ModalContent />
    </FrameModal>
  );
}
