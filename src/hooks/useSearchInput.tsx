import { useSearchParams } from 'react-router-dom';

export function useSearchInput() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const tokenType = searchParams.get('tokenType') || '';
  const blockchain = searchParams.get('blockchain') || '';
  const inputValue = searchParams.get('inputValue') || '';

  return { query, tokenType, blockchain, inputValue };
}
