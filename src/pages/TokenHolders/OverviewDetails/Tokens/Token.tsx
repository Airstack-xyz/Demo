import { ListWithMoreOptions } from './ListWithMoreOptions';
import { Poap, Token as TokenType } from '../../types';
import { Icon } from '../../../../Components/Icon';
import { useMemo, useCallback } from 'react';
import { getDAppType } from '../../utils';

export function Token({
  token,
  onShowMore
}: {
  token: TokenType | Poap | null;
  onShowMore?: (value: string[], dataType: string) => void;
}) {
  const owner = token?.owner;
  const walletAddress = owner?.addresses || '';
  const primarEns = owner?.primaryDomain?.name || '';
  const ens = owner?.domains?.map(domain => domain.name) || [];
  const xmtpEnabled = owner?.xmtp?.find(({ isXMTPEnabled }) => isXMTPEnabled);

  const { lens, farcaster } = useMemo(() => {
    const social = owner?.socials || [];
    const result = { lens: [], farcaster: [] };
    social.forEach(({ dappSlug, profileName }) => {
      const type = getDAppType(dappSlug);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const list = result[type];
      if (list) {
        list.push(profileName);
      }
    });
    return result;
  }, [owner?.socials]);

  const getShowMoreHandler = useCallback(
    (items: string[], type: string) => () => {
      onShowMore?.(items, type);
    },
    [onShowMore]
  );

  return (
    <>
      <td>
        <ListWithMoreOptions
          list={ens}
          onShowMore={getShowMoreHandler(ens, 'ens')}
        />
      </td>
      <td className="ellipsis">{primarEns || '--'}</td>
      <td className="ellipsis">{walletAddress || '--'}</td>
      <td>
        <ListWithMoreOptions
          list={lens}
          onShowMore={getShowMoreHandler(lens, 'lens')}
        />
      </td>
      <td>
        <ListWithMoreOptions
          list={farcaster}
          onShowMore={getShowMoreHandler(farcaster, 'farcaster')}
        />
      </td>
      <td>
        {xmtpEnabled ? <Icon name="xmtp" height={14} width={14} /> : '--'}
      </td>
    </>
  );
}
