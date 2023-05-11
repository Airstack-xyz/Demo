import { NftAsset } from "airstack-web-sdk-test";

type ItemProps = {
  tokenId: string;
  tokenName: string;
  tokenType: string;
  tokenAddress: string;
  amount: string;
  tokenSymbol: string;
};

export function Item({
  tokenId,
  tokenName,
  tokenType,
  amount,
  tokenAddress,
  tokenSymbol,
}: ItemProps) {
  return (
    <tr>
      <td>
        <div style={{ width: 50, height: 50 }}>
          <NftAsset
            address={tokenAddress}
            tokenId={tokenId}
            preset="original"
          />
        </div>
      </td>
      <td>{tokenId}</td>
      <td>{tokenName}</td>
      <td>{tokenSymbol}</td>
      <td>{tokenType}</td>
      <td>{tokenAddress}</td>
      <td>{amount}</td>
    </tr>
  );
}
