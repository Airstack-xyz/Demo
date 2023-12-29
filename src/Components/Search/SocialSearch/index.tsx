import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  SocialSearchItem,
  SocialSearchResponse,
  SocialSearchVariables
} from './types';
import { useLazyQueryWithPagination } from '@airstack/airstack-react';
import { SocialSearchQuery } from '../../../queries';

const LIMIT = 30;

const DISABLED_KEYS = ['ArrowUp', 'ArrowDown', 'Enter'];

export default function SocialSearch({
  mentionInputRef, // reference to mention-input element
  mentionValue, // mention-input's value containing markup for mentions
  displayValueStartIndex, // query starting index in mention-input's display value i.e. value visible to user
  displayValueEndIndex, // query ending index in mention-input's display value i.e. value visible to user
  onChange,
  onClose
}: {
  mentionInputRef: MutableRefObject<HTMLTextAreaElement | null>;
  mentionValue: string;
  displayValueStartIndex: number;
  displayValueEndIndex: number;
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  const [listItems, setListItems] = useState<SocialSearchItem[]>([]);
  const [searchRegex, setSearchRegex] = useState([]);
  const [focusIndex, setFocusIndex] = useState(0);

  const focusIndexRef = useRef(0);

  // store refs so that it can be used in events without triggering useEffect
  focusIndexRef.current = focusIndex;

  const handleData = useCallback((data: SocialSearchResponse) => {
    const nextListItems = data?.Socials?.Social || [];
    setListItems(prev => [...prev, ...nextListItems]);
  }, []);

  const [fetchData, { loading, pagination, cancelRequest }] =
    useLazyQueryWithPagination<SocialSearchResponse, SocialSearchVariables>(
      SocialSearchQuery,
      undefined,
      { onCompleted: handleData }
    );

  useEffect(() => {
    if (searchRegex.length === 0) {
      return;
    }
    fetchData({
      limit: LIMIT,
      searchRegex: searchRegex
    });
    return () => {
      cancelRequest();
    };
  }, [cancelRequest, fetchData, searchRegex]);

  return <div>SocialSearch</div>;
}
