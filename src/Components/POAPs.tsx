import { useLazyQueryWithPagination } from "@airstack/airstack-react";
import { POAPQuery } from "../queries";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ListTitle } from "./ListTitle";
export type POAPQueryReturnType = {
  Poaps: {
    Poap: {
      poapEvent: {
        eventName: string;
        startDate: string;
        isVirtualEvent: boolean;
        eventId: string;
        logo: {
          image: {
            small: string;
          };
        };
      };
    }[];
    pageInfo: {
      nextCursor: string;
      prevCursor: string;
    };
  };
};

function POAP({
  eventName,
  eventId,
  startDate,
  logo,
}: POAPQueryReturnType["Poaps"]["Poap"][0]["poapEvent"]) {
  return (
    <li className="poap">
      <div className="logo">
        {logo?.image && <img src={logo.image.small} />}
      </div>
      <div className="info">
        <h3>{eventName}</h3>
        <p>Event ID #{eventId}</p>
        <p>{startDate}</p>
      </div>
    </li>
  );
}

export function POAPs({ owner }: { owner: string }) {
  const [poaps, setPoaps] = useState<POAPQueryReturnType["Poaps"]["Poap"]>([]);

  const [fetch, { data, loading, error, pagination }] =
    useLazyQueryWithPagination(POAPQuery);

  useEffect(() => {
    if (owner) {
      fetch({
        owner,
        limit: 20,
      });
      setPoaps([]);
    }
  }, [fetch, owner]);

  useEffect(() => {
    if (data) {
      setPoaps((poaps) => [...poaps, ...(data?.Poaps?.Poap || [])]);
    }
  }, [data]);

  const handleNext = useCallback(() => {
    pagination?.getNextPage();
  }, [pagination]);

  const dataNotFound = !error && !loading && poaps.length === 0;

  return (
    <>
      <ul className="poaps">
        <ListTitle title="POAPs held" icon="poap" />
        {poaps.length === 0 && loading && (
          <li className="loader poaps-loader">Loading...</li>
        )}
        {dataNotFound && <div> No data found! </div>}
        <InfiniteScroll
          next={handleNext}
          dataLength={poaps.length}
          hasMore={pagination.hasNextPage}
          loader={<li className="loader">Loading...</li>}
        >
          {poaps.map(({ poapEvent }) => {
            return <POAP {...poapEvent} key={poapEvent.eventId} />;
          })}
        </InfiniteScroll>
        {error && poaps.length === 0 && <li> Error while fetching data! </li>}
      </ul>
    </>
  );
}
