import { useSearchInput } from '../../hooks/useSearchInput';
import { ToggleSwitch } from '../ToggleSwitch';

export type MintFilterType = '1' | '0';

export const defaultMintFilter = '0';

export function MintFilter({ disabled }: { disabled?: boolean }) {
  const [{ mintFilter }, setData] = useSearchInput();

  const isSwitchChecked = mintFilter === '1';

  const handleToggle = () => {
    setData(
      {
        mintFilter: isSwitchChecked ? '0' : '1'
      },
      { updateQueryParams: true }
    );
  };

  return (
    <ToggleSwitch
      label="Mints only"
      labelClassName="text-xs font-medium text-text-secondary"
      checked={isSwitchChecked}
      disabled={disabled}
      onClick={handleToggle}
    />
  );
}
