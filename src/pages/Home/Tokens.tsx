import { IconWithBorder } from './IconWithBorder';

function NFts() {
  return (
    <div className="flex">
      <div className="ml-2">
        <IconWithBorder
          name="abstraction-modules"
          label="NFTs"
          labelClass="bg-[#EC4442]"
        />
        <span className="text-[10px] opacity-50">ERC721, 1155</span>
      </div>
      <div className="flex flex-col justify-center -mt-2.5 -ml-1.5">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="49"
            height="23"
            viewBox="0 0 49 23"
            fill="none"
          >
            <path
              d="M48.7836 3.01831L46.0335 0.268224L43.2834 3.01831L46.0335 5.7684L48.7836 3.01831ZM0.305908 22.5478H24.3831V21.5951H0.305908V22.5478ZM25.8121 21.1188V3.97097H24.8594V21.1188H25.8121ZM26.2884 3.49464H46.0335V2.54198H26.2884V3.49464ZM25.8121 3.97097C25.8121 3.7079 26.0253 3.49464 26.2884 3.49464V2.54198C25.4992 2.54198 24.8594 3.18176 24.8594 3.97097H25.8121ZM24.3831 22.5478C25.1723 22.5478 25.8121 21.908 25.8121 21.1188H24.8594C24.8594 21.3819 24.6462 21.5951 24.3831 21.5951V22.5478Z"
              fill="#10365E"
            />
          </svg>
          <div className="text-xs card-light p-2.5 rounded-xl -mt-5 ml-1 w-24">
            Metadata
          </div>
        </div>
        <div className="flex items-end">
          <svg
            className="-mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            width="49"
            height="37"
            viewBox="0 0 49 37"
            fill="none"
          >
            <path
              d="M48.7836 33.4616L46.0335 36.2117L43.2834 33.4616L46.0335 30.7115L48.7836 33.4616ZM0.305908 0.59491H24.3831V1.54757H0.305908V0.59491ZM25.8121 2.0239V32.509H24.8594V2.0239H25.8121ZM26.2884 32.9853H46.0335V33.9379H26.2884V32.9853ZM25.8121 32.509C25.8121 32.772 26.0253 32.9853 26.2884 32.9853V33.9379C25.4992 33.9379 24.8594 33.2982 24.8594 32.509H25.8121ZM24.3831 0.59491C25.1723 0.59491 25.8121 1.23469 25.8121 2.0239H24.8594C24.8594 1.76083 24.6462 1.54757 24.3831 1.54757V0.59491Z"
              fill="#10365E"
            />
          </svg>
          <div className="text-xs card-light py-2.5 rounded-xl -mb-3.5 ml-1 w-28">
            Resized Images
          </div>
        </div>
      </div>
    </div>
  );
}

export function Tokens() {
  return (
    <div className="card p-7 rounded-18 w-full">
      <h3 className="text-left font-bold mb-5">Abstraction Modules</h3>
      <ul className="flex items-center">
        <li className="ml-2">
          <IconWithBorder name="abstraction-modules" label="Tokens" />
          <span className="text-[10px] opacity-50">ERC20</span>
        </li>
        <li className="ml-2">
          <NFts />
        </li>
      </ul>
    </div>
  );
}
