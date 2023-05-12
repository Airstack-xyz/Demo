/*
  STEP 10: Import NftAsset component from airstack-web-sdk
*/
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
          {/*
            STEP 11: Add NftAsset component to render the image
              chain (optional): a string representing the blockchain network to use. Defaults to "ethereum".
              address (required): a string representing the contract address of the NFT.
              tokenId (required): a string representing the token ID of the NFT.
              loading (optional): a React node to show while the asset is loading.
              error (optional): a React node to show if there is an error loading the asset.
              imgProps (optional): an object of HTML image attributes to pass to the underlying image element.
              preset (optional): a string representing the size of the asset image to display. Can be one of "extraSmall", "small", "medium", "large", or "original". Defaults to "medium".
          */}
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
