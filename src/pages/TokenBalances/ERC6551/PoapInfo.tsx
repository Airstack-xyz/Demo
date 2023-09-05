import { Poap, TokenTransfer } from './types';
import { KeyValue } from './KeyValue';

export function PoapInfo({
  poap,
  transfterDetails
}: {
  poap: Poap;
  transfterDetails: TokenTransfer;
}) {
  const metadata = poap?.poapEvent?.metadata || {};
  const poapEvent = poap?.poapEvent || {};

  return (
    <div className="overflow-hidden text-sm">
      <KeyValue name="Event ID" value={poap.eventId} />
      <KeyValue name="Start date" value={poapEvent.startDate} />
      <KeyValue name="End date" value={poapEvent.endDate} />
      <KeyValue name="Location" value={poapEvent.city} />
      <KeyValue name="Event url" value={metadata.home_url} />
      <KeyValue
        name="Last transfer block"
        value={transfterDetails.blockNumber}
      />
      <KeyValue name="Total supply" value={poapEvent.tokenMints} />
      <KeyValue name="Description" value={metadata.description} />
      <KeyValue name="Token URI" value={poap.tokenUri} />
      <KeyValue name="Image URl" value={metadata.image_url} />
    </div>
  );
}
