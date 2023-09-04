import { ReactNode } from 'react';

function IconAndText({ icon, text }: { icon: string; text: ReactNode }) {
  return (
    <div className="mb-6 flex items-center font-medium">
      <img
        src={`/images/${icon}.svg`}
        alt=""
        height={35}
        width={35}
        className="mr-3.5 rounded-full"
      />{' '}
      {text}
    </div>
  );
}

export function ERC6551TokenHolder() {
  return (
    <div className="w-[955px] max-w-full">
      <div className="text-sm rounded-18 overflow-hidden flex items-center bg-glass w-full">
        <div className="m-2.5 p-6 border-solid-stroke rounded-18 bg-glass flex-1">
          <div>
            <span className="rounded-18 px-2.5 py-1 bg-glass-1-light border-solid-stroke">
              ERC6551
            </span>
          </div>
          <div className="text-xl my-5">
            <span className="mr-1.5 text-text-secondary">Holder</span>{' '}
            <span>0xa7Ca2C867...CC2b0Db22A</span>
          </div>
          <IconAndText icon="xmtp" text={<span>have xmtp messaging</span>} />
          <IconAndText
            icon="ens"
            text={
              <>
                <span className="text-text-secondary mr-1.5">Primary ENS</span>{' '}
                <span>emperor.eth</span>
              </>
            }
          />
          <IconAndText
            icon="ens"
            text={
              <>
                <span className="text-text-secondary mr-1.5">Other ENS</span>{' '}
                <span>emperor123.eth</span>
              </>
            }
          />
          <IconAndText icon="lens" text={<span>emperor.lens</span>} />
          <IconAndText icon="farcaster" text={<span>emperor</span>} />
        </div>
        <div className="rounded-18 overflow-hidden h-[422px] w-[422px]">
          {/* <Asset/> */}
        </div>
      </div>
      <div className="mt-7 text-center">
        <button className="px-11 py-3.5 rounded-full bg-button-primary font-semibold">
          See details of this ERC6551
        </button>
      </div>
    </div>
  );
}
