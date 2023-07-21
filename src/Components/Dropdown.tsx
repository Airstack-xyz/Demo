import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import classNames from 'classnames';

type Options = {
  label: string;
  link: string;
};
export function Dropdown({ options }: { options: Options[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div
      className="text-xs font-medium relative flex flex-col items-center"
      ref={ref}
    >
      <button
        className="py-2 px-5 text-text-button bg-secondary rounded-full text-xs font-medium flex-row-center outline-none"
        onClick={() => setShow(show => !show)}
      >
        <span>GraphQL APIs</span>
        <Icon
          name="arrow-down"
          height={16}
          width={16}
          className={classNames('ml-1 mt-0.5 transition', {
            'rotate-180': show
          })}
        />
      </button>
      {show && (
        <div
          className="bg-glass rounded-18 p-1 mt-1 flex flex-col absolute z-10 min-w-[120%] top-full"
          onClick={() => setShow(false)}
        >
          {options.map(({ label, link }) => (
            <a
              className="py-2 px-5 text-text-button rounded-full hover:bg-glass mb-1 cursor-pointer text-left whitespace-nowrap"
              target="_blank"
              href={link}
              key={label}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
