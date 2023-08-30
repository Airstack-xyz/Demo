import { useQuery } from '@airstack/airstack-react';
import { Icon } from '../../Components/Icon';
import { Token } from './Token';
import { erc6551DetailsQuery } from '../../queries/erc6551-details';

const infoOptions = [
  'Contract',
  'Holder',
  'Assets included',
  'Traits',
  'Last transfer time',
  'Last transfer block',
  'Last transfer hash',
  'Token URI',
  ''
];

export function ERC6551Details() {
  const { data } = useQuery(erc6551DetailsQuery, {
    blockchain: 'polygon',
    tokenAddress: '0x99d3fd2f1cf2e99c43f95083b98033d191f4eabb',
    tokenId: '10'
  });

  // eslint-disable-next-line no-console
  console.log(data);

  return (
    <div className="bg-glass border-solid-stroke rounded-18 flex p-5">
      <div className="mr-7">
        <Token token={null} />
        <button className="py-10 px-10 mt-7">
          <Icon name="token-holders" />
          <span>View holders</span>
        </button>
      </div>
      <div className="text-sm">
        {infoOptions.map((option, index) => (
          <div className="flex mb-3" key={index}>
            <div className="w-32 mr-2">{option}</div>
            <div className="text-text-secondary"> -- </div>
          </div>
        ))}
      </div>
    </div>
  );
}
