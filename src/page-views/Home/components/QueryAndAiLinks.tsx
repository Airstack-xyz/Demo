import { Icon } from './Icon';
import { Link } from './Link';
const link = 'https://app.airstack.xyz';

export function QueryAndAiLinks() {
  return (
    <div className="w-full flex-col-h-center">
      <Link
        to={link}
        className="card p-6 rounded-xl flex-row-center flex-1 text-center font-semibold"
      >
        <Icon name="ai-query" width={33} height={18} /> AI Query Engine
      </Link>
      <Link
        to={link}
        className="card p-6 rounded-xl flex-row-center flex-1 ml-5 text-center font-semibold"
      >
        <Icon name="ai-api" width={16} height={16} /> AI APIs (in dev)
      </Link>
    </div>
  );
}
