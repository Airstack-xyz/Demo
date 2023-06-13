import { useQuery } from "@airstack/airstack-react";
import { POAPQuery } from "../queries";
import { useMemo } from "react";

function POAP({
  image,
  name,
  date,
  eventId,
}: {
  image: string;
  name: string;
  eventId: string;
  date: string;
}) {
  return (
    <li>
      <img src={image} />
      <div>
        <h3>{name}</h3>
        <p>Event ID #{eventId}</p>
        <p>{date}</p>
      </div>
    </li>
  );
}

export function POAPs({ owner }: { owner: string }) {
  const variables = useMemo(() => {
    return {
      owner: owner,
      tokenType: "ERC721",
      tokenAddress: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
      blockchain: "ethereum",
      limit: 20,
    };
  }, [owner]);

  const { data, error, loading } = useQuery(POAPQuery, variables);

  console.log(" data ", data, data?.TokenBalances?.TokenBalance);
  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (!data?.TokenBalances?.TokenBalance) return null;

  return (
    <ul>
      {data.TokenBalances.TokenBalance.map(({ tokenNfts }: any) => {
        const { name, image } = tokenNfts?.metaData || {};
        return (
          <POAP
            name={name}
            image={image}
            date={tokenNfts.lastTransferTimestamp}
          />
        );
      })}
    </ul>
  );
}
