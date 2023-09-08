export function activeTokenInfoString(
  tokenAddress: string,
  tokenId: string,
  blockchain: string,
  eventId?: string | null
) {
  return `${tokenAddress} ${tokenId} ${blockchain} ${eventId || ''}`;
}
