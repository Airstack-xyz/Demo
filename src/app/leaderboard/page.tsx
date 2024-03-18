'use client';
import LazyImage from '@/Components/LazyImage';
import classnames from 'classnames';
// const loaderData = Array(6).fill({});
const tempData = [
  {
    rank: 1,
    profileImage: '',
    name: 'John Doe',
    fid: '4356',
    swaps: 10,
    referrals: 20,
    totalPoints: 30
  },
  {
    rank: 2,
    profileImage: '',
    name: 'John Doe',
    fid: '4356',
    swaps: 10,
    referrals: 20,
    totalPoints: 30
  },
  {
    rank: 3,
    profileImage: '',
    name: 'John Doe',
    fid: '4356',
    swaps: 10,
    referrals: 20,
    totalPoints: 30
  }
];

type ItemProps = {
  rank: number;
  profileImage: string;
  name: string;
  fid: string;
  swaps: number;
  referrals: number;
  totalPoints: number;
};

function Td({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className="align-middle py-4 px-2.5">
      <div className={classnames('text-sm', className)}>{children}</div>
    </td>
  );
}

function Item({
  rank,
  profileImage,
  name,
  fid,
  swaps,
  referrals,
  totalPoints
}: ItemProps) {
  return (
    <>
      <Td className="px-2.5 py-2.5 pl-5">{rank}</Td>
      <Td>
        <LazyImage
          src={profileImage}
          className="rounded overflow-hidden size-14 object-cover"
        />
      </Td>
      <Td>{name}</Td>
      <Td>#{fid}</Td>
      <Td>{swaps}</Td>
      <Td>{referrals}</Td>
      <Td>{totalPoints}</Td>
    </>
  );
}

export default function Leaderboard() {
  return (
    <div className="content">
      <h1 className="text-[44px] mb-12 pt-7">Airstack Points Leaderboard</h1>
      <div className="flex">
        <div className="bg-primary border border-solid border-[#10365E] rounded-lg pt-3">
          <table className="table-fixed w-full max-w-5xl border-spacing-10 ">
            <thead>
              <tr className="[&>th]:bg-token rounded-lg [&>th]:p-2.5 [&>th]:text-left text-xs font-bold">
                <th className="!bg-transparent !p-0 w-24">
                  <div className="rounded-l-lg bg-token px-2.5 py-2.5 pl-5 ml-2">
                    #
                  </div>
                </th>
                <th className="w-36">Profile Image</th>
                <th>Name</th>
                <th className="w-32">FID</th>
                <th className="w-32">Swaps</th>
                <th className="w-32">Referrals</th>

                <th className="!bg-transparent !p-0 w-32">
                  <div className="rounded-r-lg bg-token p-2.5 mr-2">Total</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tempData.map((data, index) => (
                <tr key={index} className="even:bg-token">
                  <Item {...data} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
