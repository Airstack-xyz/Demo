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
        <div className="hidden sm:flex-row-center text-sm gap-[30px]">
          {user && <CSVDownloads />}
          <a
            className="font-bold text-[8px] bg-glass-1 hover:opacity-90 w-10 h-[30px] rounded-18 flex items-center justify-center"
            href="https://app.airstack.xyz/api-studio"
            target="_blank"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="4.6333"
                width="20"
                height="10.6667"
                rx="3.20875"
                fill="#8B8EA0"
              />
              <path
                d="M4.57204 12.85H3.25386L5.26238 7.03182H6.84761L8.85329 12.85H7.53511L6.07772 8.36137H6.03227L4.57204 12.85ZM4.48965 10.5631H7.60329V11.5233H4.48965V10.5631ZM9.88691 12.85V7.03182H12.1824C12.6236 7.03182 12.9996 7.1161 13.3102 7.28467C13.6208 7.45133 13.8576 7.68334 14.0204 7.98069C14.1852 8.27614 14.2676 8.61705 14.2676 9.00342C14.2676 9.38978 14.1843 9.73069 14.0176 10.0261C13.8509 10.3216 13.6094 10.5517 13.2932 10.7165C12.9788 10.8813 12.5981 10.9636 12.1511 10.9636H10.688V9.97785H11.9522C12.189 9.97785 12.3841 9.93713 12.5375 9.85569C12.6928 9.77235 12.8083 9.65777 12.8841 9.51194C12.9617 9.36421 13.0005 9.1947 13.0005 9.00342C13.0005 8.81023 12.9617 8.64167 12.8841 8.49773C12.8083 8.3519 12.6928 8.23921 12.5375 8.15967C12.3822 8.07823 12.1852 8.03751 11.9466 8.03751H11.117V12.85H9.88691ZM16.63 7.03182V12.85H15.3999V7.03182H16.63Z"
                fill="#24242D"
              />
            </svg>
          </a>
          <a
            className="font-bold text-[8px] bg-glass-1 hover:opacity-90 w-10 h-[30px] rounded-18 flex items-center justify-center"
            href="https://app.airstack.xyz/sdks"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <rect
                width="20"
                height="10.6667"
                y="4.6333"
                fill="#8B8EA0"
                rx="3.2088"
              />
              <path
                fill="#24242D"
                d="M5.3725 8.7051c-.0227-.2292-.1202-.4072-.2926-.534-.1723-.127-.4062-.1904-.7017-.1904-.2007 0-.3702.0284-.5085.0852-.1382.055-.2443.1316-.3182.2301-.072.0985-.108.2103-.108.3353-.0037.1041.018.195.0654.2727.0492.0776.1165.1449.2017.2017.0852.055.1837.1032.2955.1449.1117.0397.231.0738.358.1022l.5227.125c.2537.0569.4867.1326.6988.2273.2121.0947.3958.2112.5511.3495.1553.1382.2756.3011.3608.4886.0872.1875.1317.4024.1336.6449-.002.356-.0928.6647-.2728.9261-.178.2595-.4356.4612-.7727.6051-.3352.1421-.7396.2131-1.213.2131-.4698 0-.8788-.072-1.2273-.2159-.3466-.144-.6175-.357-.8125-.6392-.1932-.2841-.2945-.6354-.304-1.054H3.219c.0133.1951.0692.358.1677.4886.1003.1288.2338.2264.4005.2927.1686.0643.359.0965.571.0965.2084 0 .3892-.0303.5427-.0909.1553-.0606.2755-.1449.3608-.2528.0852-.108.1278-.232.1278-.3722 0-.1306-.0388-.2405-.1165-.3295-.0758-.089-.1875-.1648-.3352-.2273-.1459-.0625-.3248-.1193-.537-.1704l-.6335-.1591c-.4905-.1193-.8778-.3059-1.1619-.5597-.284-.2538-.4252-.5956-.4233-1.0256-.0019-.3522.0919-.66.2813-.9232.1912-.2633.4536-.4688.7869-.6165.3333-.1478.7121-.2216 1.1364-.2216.4318 0 .8087.0738 1.1306.2216.3239.1477.5758.3532.7557.6165.18.2632.2727.5681.2784.9147h-1.179ZM9.8543 12.85H7.7918V7.0318h2.0796c.5852 0 1.089.1165 1.5113.3495.4224.231.7472.5634.9745.9971.2291.4337.3437.9527.3437 1.5568 0 .6061-.1146 1.1269-.3437 1.5625-.2273.4356-.554.7699-.9802 1.0029-.4242.2329-.9318.3494-1.5227.3494Zm-.8324-1.054h.7813c.3636 0 .6695-.0644.9176-.1932.25-.1306.4375-.3323.5625-.6051.1269-.2746.1903-.6288.1903-1.0625 0-.4299-.0634-.7812-.1903-1.054-.125-.2727-.3116-.4734-.5597-.6022-.2481-.1288-.5539-.1932-.9176-.1932h-.784v3.7102Zm4.9236 1.054V7.0318h1.2301v2.5654h.0767l2.0937-2.5654h1.4745L16.6614 9.637l2.1846 3.213h-1.4716l-1.5937-2.392-.6051.7386V12.85h-1.2301Z"
              />
            </svg>
          </a>
          <a
            className="text-text-button font-bold bg-glass-1 hover:opacity-90 px-2.5 py-1 rounded-18"
            href="https://github.com/Airstack-xyz/Demo"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fill="#8B8EA0"
                fill-rule="evenodd"
                d="M9.9995 2c4.4184 0 8 3.672 8 8.2023 0 3.6232-2.2896 6.6969-5.4664 7.7825-.4056.0808-.5496-.1754-.5496-.3938 0-.2704.0096-1.1536.0096-2.2512 0-.7648-.256-1.2639-.5432-1.5183 1.7816-.2032 3.6536-.8969 3.6536-4.0473 0-.896-.3104-1.6271-.824-2.2015.0832-.2072.3576-1.0415-.0784-2.1711 0 0-.6704-.2198-2.1976.841-.6392-.1816-1.324-.273-2.004-.2762-.68.0032-1.364.0946-2.0024.2762-1.5288-1.0608-2.2008-.841-2.2008-.841-.4344 1.1296-.16 1.9639-.0776 2.171-.5112.5745-.824 1.3056-.824 2.2016 0 3.1424 1.868 3.8467 3.6448 4.0539-.2288.2048-.436.5661-.508 1.0965-.456.2096-1.6144.5724-2.328-.6812 0 0-.4232-.7881-1.2264-.8457 0 0-.78-.0104-.0544.4984 0 0 .524.252.888 1.2 0 0 .4696 1.464 2.6952.968.004.6856.0112 1.3317.0112 1.5269 0 .2168-.1472.4706-.5464.3945-3.1792-1.084-5.4712-4.1592-5.4712-7.7832C1.9995 5.6719 5.582 2 9.9995 2Z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
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
        </div>
      </div>
    </header>
  );
}
