/* eslint-disable react-refresh/only-export-components */
import { useCallback, useMemo } from 'react';
import { snapshotBlockchains, tokenBlockchains } from '../../constants';
import { useSearchInput } from '../../hooks/useSearchInput';
import { SnapshotBlockchain, TokenBlockchain } from '../../types';
import { capitalizeFirstLetter } from '../../utils';
import { Dropdown, Option } from '../Dropdown';
import { DisabledTooltip, useDisabledTooltip } from './DisabledTooltip';
import { FilterOption } from './FilterOption';
import { FilterPlaceholder } from './FilterPlaceholder';
import {
  checkBlockchainSupportForSnapshot,
  getActiveSnapshotInfo
} from '../../utils/activeSnapshotInfoString';

export type BlockchainFilterType = 'all' | TokenBlockchain | SnapshotBlockchain;

export const defaultBlockchainFilter: BlockchainFilterType = 'all';

type BlockchainOption = {
  label: string;
  value: BlockchainFilterType;
  disabled?: boolean;
};

export const getBlockchainOptions = (isSnapshotApplicable?: boolean) => {
  const options: BlockchainOption[] = [
    {
      label: 'All chains',
      value: 'all'
    }
  ];

  tokenBlockchains.forEach(blockchain => {
    options.push({
      label: capitalizeFirstLetter(blockchain),
      value: blockchain,
      disabled: isSnapshotApplicable
        ? !checkBlockchainSupportForSnapshot(blockchain)
        : false
    });
  });

  if (isSnapshotApplicable) {
    // Find blockchains which are in snapshotBlockchains but not in tokenBlockchains
    const filteredBlockchains = snapshotBlockchains.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      blockchain => tokenBlockchains.indexOf(blockchain) === -1
    );

    filteredBlockchains.forEach(blockchain => {
      options.push({
        label: capitalizeFirstLetter(blockchain),
        value: blockchain,
        disabled: false
      });
    });
  }

  return options;
};

export function BlockchainFilter({
  disabled,
  disabledTooltipText
}: {
  disabled?: boolean;
  disabledTooltipText?: string;
}) {
  const [searchInputs, setData] = useSearchInput();
  const {
    tooltipRef,
    containerRef,
    handleTooltipShow,
    handleTooltipHide,
    handleTooltipMove
  } = useDisabledTooltip();

  const activeSnapshotInfo = searchInputs.activeSnapshotInfo;
  const blockchainType = searchInputs.blockchainType as BlockchainFilterType[];

  const snapshotInfo = useMemo(
    () => getActiveSnapshotInfo(activeSnapshotInfo),
    [activeSnapshotInfo]
  );

  const enableTooltipHover = disabled && Boolean(disabledTooltipText);

  const isFilterDisabled = disabled;

  const handleChange = useCallback(
    (selected: Option[]) => {
      setData(
        {
          blockchainType:
            selected[0].value === defaultBlockchainFilter
              ? []
              : [selected[0].value]
        },
        { updateQueryParams: true }
      );
    },
    [setData]
  );

  const options = useMemo(
    () => getBlockchainOptions(snapshotInfo.isApplicable),
    [snapshotInfo.isApplicable]
  );

  const selected = useMemo(() => {
    const filterValue = blockchainType[0];
    const option = options.find(item => item.value === filterValue);
    if (option) {
      return [option];
    }
    return [options[0]];
  }, [blockchainType, options]);

  return (
    <Dropdown
      heading="Blockchain"
      selected={selected}
      onChange={handleChange}
      options={options}
      disabled={isFilterDisabled}
      renderPlaceholder={(selected, isOpen) => (
        <div
          className="relative"
          ref={containerRef}
          onMouseEnter={enableTooltipHover ? handleTooltipShow : undefined}
          onMouseLeave={enableTooltipHover ? handleTooltipHide : undefined}
          onMouseMove={enableTooltipHover ? handleTooltipMove : undefined}
        >
          <FilterPlaceholder
            icon="blockchain-filter"
            isOpen={isOpen}
            isDisabled={isFilterDisabled}
            label={selected[0].label}
          />
          <DisabledTooltip
            isEnabled={enableTooltipHover}
            tooltipRef={tooltipRef}
            tooltipText={disabledTooltipText}
          />
        </div>
      )}
      renderOption={({ option, isSelected, setSelected }) => (
        <FilterOption
          isSelected={isSelected}
          isDisabled={option.disabled}
          label={option.label}
          onClick={() => {
            setSelected([option]);
          }}
        />
      )}
    />
  );
}
