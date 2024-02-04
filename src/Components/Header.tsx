import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CSVDownloads } from './CSVDownload/CSVDownloads';
import { Profile } from './Profile';

export function Header() {
  const { user, login } = useAuth();

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
        <div className="hidden sm:flex-row-center text-sm">
          <span className="ml-5">
            <CSVDownloads />
          </span>
          <a
            className="text-text-button font-bold bg-glass-1 hover:opacity-90 px-2.5 py-1px-2.5 py-1 rounded-18 mx-7"
            href="https://github.com/Airstack-xyz/Demo"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M10.7954 13.5194C11.3063 13.7062 11.7349 14.0673 12.0059 14.539C12.2768 15.0107 12.3726 15.5629 12.2764 16.0983C12.1803 16.6337 11.8983 17.1181 11.4802 17.4661C11.062 17.814 10.5345 18.0034 9.99057 18.0007C9.44658 17.998 8.92098 17.8035 8.5063 17.4514C8.09161 17.0994 7.81443 16.6123 7.72354 16.0759C7.63265 15.5396 7.73389 14.9884 8.00943 14.5193C8.28498 14.0503 8.71716 13.6935 9.22989 13.5117V12.7055C9.22989 12.6485 9.2322 12.5915 9.23605 12.5353C9.2131 12.4336 9.16973 12.3376 9.10858 12.2532C9.04743 12.1687 8.96976 12.0976 8.88029 12.0441L6.50396 10.6218C6.16122 10.4168 5.87748 10.1264 5.68044 9.77903C5.4834 9.43164 5.37979 9.03911 5.37971 8.63973V7.08734C4.86572 6.90568 4.4325 6.54816 4.15662 6.07797C3.88074 5.60778 3.77997 5.0552 3.87213 4.51789C3.96428 3.98059 4.24342 3.49316 4.66021 3.14177C5.077 2.79038 5.6046 2.59766 6.14975 2.59766C6.6949 2.59766 7.22249 2.79038 7.63928 3.14177C8.05607 3.49316 8.33521 3.98059 8.42737 4.51789C8.51952 5.0552 8.41875 5.60778 8.14288 6.07797C7.867 6.54816 7.43378 6.90568 6.91978 7.08734V8.63973C6.91983 8.77288 6.95441 8.90374 7.02014 9.01954C7.08586 9.13534 7.18049 9.23211 7.29479 9.30042L9.67112 10.7219C9.79221 10.7945 9.9064 10.878 10.0122 10.9714C10.1183 10.8779 10.2328 10.7944 10.3541 10.7219L12.7305 9.30042C12.8448 9.23211 12.9394 9.13534 13.0051 9.01954C13.0708 8.90374 13.1054 8.77288 13.1055 8.63973V7.09658C12.5877 6.91979 12.1495 6.56506 11.8688 6.09549C11.588 5.62592 11.483 5.07198 11.5724 4.53224C11.6617 3.9925 11.9397 3.50196 12.3568 3.14792C12.7738 2.79388 13.303 2.5993 13.8501 2.5988C14.3929 2.59858 14.9184 2.78949 15.3345 3.13805C15.7506 3.48661 16.0307 3.97056 16.1256 4.50499C16.2205 5.03942 16.1242 5.59021 15.8535 6.06072C15.5829 6.53123 15.1552 6.89142 14.6455 7.0781V8.63973C14.6455 9.03911 14.5419 9.43164 14.3448 9.77903C14.1478 10.1264 13.864 10.4168 13.5213 10.6218L11.145 12.0433C11.0555 12.0968 10.9778 12.168 10.9167 12.2524C10.8555 12.3369 10.8122 12.4329 10.7892 12.5346C10.7931 12.5908 10.7954 12.6478 10.7954 12.704V13.5202V13.5194Z"
                fill="#8B8EA0"
              />
            </svg>
          </a>
          {/* <a
            className="text-text-button font-bold hover:bg-glass px-7 py-2 rounded-18 mr-2"
            href="https://app.airstack.xyz/api-studio"
            target="_blank"
          >
            API
          </a> */}
          <a
            className="font-bold text-[8px] bg-glass-1 hover:opacity-90 w-10 h-[30px] rounded-18 flex items-center justify-center"
            href="https://app.airstack.xyz/sdks"
            target="_blank"
          >
            <span className="bg-[#8B8EA0] text-tertiary p-0.5 rounded-sm leading-3">
              SDK
            </span>
          </a>
          <span className="ml-7">
            {user ? (
              <Profile />
            ) : (
              <button
                className="h-[30px] border border-solid border-white px-5 rounded-18 hover:opacity-90"
                onClick={() => {
                  login();
                }}
              >
                Sign In
              </button>
            )}
            {}
          </span>
        </div>
      </div>
    </header>
  );
}
