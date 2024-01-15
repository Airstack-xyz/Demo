/* eslint-disable react-refresh/only-export-components */
import { useSearchInput } from '../../hooks/useSearchInput';
import { ToggleSwitch } from '../ToggleSwitch';

export type ResolveTBAFilterType = '1' | '0';

export const defaultResolveTBAFilter = '0';

export function ResolveTBAFilter({ disabled }: { disabled?: boolean }) {
  const [{ resolveTBAFilter }, setData] = useSearchInput();

  const isSwitchChecked = resolveTBAFilter === '1';

  const handleToggle = () => {
    setData(
      {
        resolveTBAFilter: isSwitchChecked ? '0' : '1'
      },
      { updateQueryParams: true }
    );
  };

  return (
    <ToggleSwitch
      label="Resolve TBA holders"
      labelClassName="text-xs font-medium text-text-secondary"
      checked={isSwitchChecked}
      disabled={disabled}
      onClick={handleToggle}
    />
  );
}
