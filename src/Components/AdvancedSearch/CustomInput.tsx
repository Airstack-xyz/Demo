import { useState } from 'react';
import { ADDRESS_OPTION_ID, POAP_OPTION_ID } from '../Input/constants';
import { getCustomInputMention } from './utils';

export type CustomInputModeType =
  | typeof ADDRESS_OPTION_ID
  | typeof POAP_OPTION_ID;

export default function CustomInput({
  mode,
  onAdd
}: {
  mode: CustomInputModeType;
  onAdd: (value: string) => void;
}) {
  const [value, setValue] = useState('');

  const handleAddClick = () => {
    const mentionValue = getCustomInputMention(value, mode);
    onAdd(mentionValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyboardKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleAddClick();
    }
  };

  return (
    <div className="flex-row-center mb-[20px] px-[12px] py-[12px] bg-glass-1 rounded-full max-w-[590px]">
      <input
        autoFocus
        type="text"
        className="w-full pr-2 bg-transparent caret-white outline-none text-xs"
        placeholder={
          mode === ADDRESS_OPTION_ID
            ? 'Enter contract address here'
            : 'Enter POAP event id here'
        }
        onChange={handleInputChange}
        onKeyUp={handleKeyboardKeyUp}
      />
      <button
        onClick={handleAddClick}
        className="text-text-button text-xs font-medium"
      >
        ADD
      </button>
    </div>
  );
}
