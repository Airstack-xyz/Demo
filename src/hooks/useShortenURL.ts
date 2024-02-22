import { useCallback, useState } from 'react';
import { apiKey } from '../constants';
import { UrlShortenMutation } from '../queries';

type ShortenedUrlResponse = {
  ShortenUrl: ShortenedUrlData;
};

type ShortenedUrlVariables = {
  longUrl: string;
};

type ShortenedUrlData = {
  actualUrl: string;
  shortenedUrl: string;
};

const MENTION_ENDPOINT = process.env.MENTION_ENDPOINT as string;

export async function shortenUrl(longUrl: string) {
  const variables: ShortenedUrlVariables = { longUrl };

  try {
    const res = await fetch(MENTION_ENDPOINT, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey
      },
      body: JSON.stringify({
        query: UrlShortenMutation,
        variables
      })
    });

    const json = await res.json();
    const data = json?.data as ShortenedUrlResponse;

    if (json?.errors) {
      return { data: null, error: json.errors };
    }
    if (data?.ShortenUrl) {
      return { data: data.ShortenUrl, error: null };
    }
  } catch (err) {
    return { data: null, error: err as unknown };
  }

  return { data: null, error: null };
}

export function useShortenURL() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState<ShortenedUrlData | null>(null);

  const fetchShortenedUrl = useCallback(async (longUrl: string) => {
    setStatus('loading');
    setData(null);

    const { data, error } = await shortenUrl(longUrl);

    if (error) {
      setStatus('error');
    }
    if (data) {
      setStatus('idle');
      setData(data);
    }

    return { data, error };
  }, []);

  return {
    fetchShortenedUrl,
    data,
    loading: status === 'loading',
    error: status === 'error'
  };
}
