import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed bg-secondary py-4 w-full z-20 flex justify-center top-0">
      <div className="w-[1440px] max-w-[100vw] flex items-center justify-center sm:justify-between px-8">
        <Link to="/">
          <img src="/logo.svg" className="h-[33px]" />
        </Link>
        <div className="hidden sm:flex-row-center">
          <a
            className="text-text-button font-bold hover:bg-primary px-7 py-2 rounded-md  mr-2"
            href="https://github.com/Airstack-xyz/Demo"
            target="_blank"
          >
            Fork Code
          </a>
          <a
            className="text-text-button font-bold hover:bg-primary px-7 py-2 rounded-md  mr-2"
            href="https://app.airstack.xyz/"
            target="_blank"
          >
            API
          </a>
          <a
            className="text-text-button font-bold hover:bg-primary px-7 py-2 rounded-md"
            href="https://app.airstack.xyz/sdks"
            target="_blank"
          >
            SDK
          </a>
        </div>
      </div>
    </header>
  );
}
