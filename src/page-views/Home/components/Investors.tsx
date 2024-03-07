import { Image } from '@/Components/Image';

const investorNames = [
  'Serge Ravitch',
  'David Choi',
  'Gil Penchina',
  'Dan Romero',
  'Stani Kulechov',
  'Sandeep Nailwal',
  'Alaeddin Hadad',
  'Tom Howard',
  'Allen Day',
  'Yannick Monye',
  'Allen Morgan',
  'Eddie Lou',
  'Nate McKervey',
  'Gokul Rajaram',
  'Grady Burnett',
  'Jeff Gann',
  'Martin Crowley',
  'Amanda Cassat'
];

const totalInvestersImages = 34;
const investorsImages = Array.from(
  { length: totalInvestersImages },
  (_, i) => i + 1
);
export function Investors() {
  return (
    <div className="w-full">
      <h2 className="text-center text-3xl mb-16 font-semibold">Backed By</h2>
      <div>
        <ul className="flex items-center gap-x-3 sm:gap-x-[105px] gap-y-10 justify-between flex-wrap">
          {investorsImages.map(index => (
            <li key={index}>
              <Image
                src={`images/investors/${index}.svg`}
                alt={`investor-${index}`}
              />
            </li>
          ))}
          {investorNames.map((name, index) => (
            <li
              key={index}
              className="text-white opacity-50 text-sm font-semibold"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
