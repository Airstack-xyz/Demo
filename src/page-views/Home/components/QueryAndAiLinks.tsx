import { Icon } from './Icon';
import { Link } from './Link';
const link = 'https://app.airstack.xyz';

export function QueryAndAiLinks() {
  return (
    <div className="w-full flex flex-col sm:flex-row">
      <Link
        to={link}
        className="card p-6 rounded-xl flex-row-center flex-1 text-center font-semibold"
      >
        <Icon name="ai-query" width={33} height={18} className="mr-1.5" /> AI
        Query Engine
      </Link>
      <Link
        to={link}
        className="card p-6 rounded-xl flex-row-center flex-1 ml-0 sm:ml-5 mt-5 sm:mt-0 text-center font-semibold"
      >
        <Icon name="ai-api" width={16} height={16} className="mr-1.5" /> AI APIs
        (in dev)
      </Link>
    </div>
  );
}
