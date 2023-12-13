import { useCallback, useEffect, useRef, useState } from 'react';

import './styles.css';

type AddressInputProps = {
  top: string;
  left: string;
  right: string;
  placeholder: string;
  onRequestClose: (address: string) => void;
};

export function AddressInput({
  top,
  left,
  right,
  placeholder,
  onRequestClose
}: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState('');
  const addressRef = useRef(address);

  useEffect(() => {
    // In safari when focusing on input, using autofocus or programmatically,
    // the caret is not visible in the input even though the input is focused.
    // User will not be type in the input unless they click on it.
    // This is a workaround to fix this issue

    inputRef.current?.setSelectionRange(0, 0);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove all spaces before saving the address
      const _address = (e.target.value || '').replace(/\s+/, '');
      setAddress(_address);
      addressRef.current = _address;
    },
    []
  );

  const handleClick = useCallback(() => {
    onRequestClose(addressRef.current);
  }, [onRequestClose]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleClick();
      }
      if (e.key === 'Escape') {
        onRequestClose('');
      }
    };
    // use setTimeout to avoid the handler being called immediately when the user clicked the option using mouse
    setTimeout(() => {
      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeydown);
    }, 0);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleClick, onRequestClose]);

  return (
    <span
      className="addressInput"
      style={{ top, left, right }}
      onClick={e => e.stopPropagation()}
    >
      <input
        autoFocus
        ref={inputRef}
        value={address}
        placeholder={placeholder}
        onChange={handleInputChange}
      />
      <button onClick={handleClick}>Add</button>
    </span>
  );
}
