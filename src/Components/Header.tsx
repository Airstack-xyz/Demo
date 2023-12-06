import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, loading, login, logout } = useAuth();
  return (
    <header className="fixed bg-glass-1 py-4 z-[100] top-0 left-0 right-0 max-sm:absolute">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-center sm:justify-between px-8">
        <div className="text-xl flex-row-center">
          <Link to="https://app.airstack.xyz" className="" target="_blank">
            <img src="/logo.svg" className="h-[33px] mr-5" />
          </Link>
          <Link to="/">
            <h1 className="pl-5 py-1 border-l-[3px] border-solid border-stroke-color-light">
              Explorer
            </h1>
          </Link>
        </div>
        <div className="hidden sm:flex-row-center">
          {user ? (
            <div>
              <span>{user?.communicationEmail || 'no user name'} </span>
              <button onClick={logout} disabled={loading}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={login} disabled={loading}>
              Login
            </button>
          )}
          <a
            className="text-text-button font-bold hover:bg-glass px-7 py-2 rounded-18  mr-2"
            href="https://github.com/Airstack-xyz/Demo"
            target="_blank"
          >
            Fork Code
          </a>
          <a
            className="text-text-button font-bold hover:bg-glass px-7 py-2 rounded-18  mr-2"
            href="https://app.airstack.xyz/api-studio"
            target="_blank"
          >
            API
          </a>
          <a
            className="text-text-button font-bold hover:bg-glass px-7 py-2 rounded-18"
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
