import classNames from 'classnames';
import { useMatch } from 'react-router-dom';
import { MAX_SEARCH_WIDTH } from '../../Components/Search/constants';
import { Search } from '../../Components/Search';

export function Channels() {
  const isHome = useMatch('/');
  return (
    <div
      className={classNames('px-2 pt-5 max-w-[1440px] mx-auto sm:pt-8', {
        'flex-1 h-full w-full flex flex-col !pt-[12vw] items-center text-center':
          isHome
      })}
    >
      <div style={{ maxWidth: MAX_SEARCH_WIDTH }} className="mx-auto w-full">
        {isHome && <h1 className="text-[2rem]">Explore web3 identities</h1>}
        <Search />
        <h1> Channels </h1>
      </div>
    </div>
  );
}
