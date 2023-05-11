import { Item } from "./Item";

function Header() {
  return (
    <thead>
      <tr>
        <th>Token Image</th>
        <th>ID</th>
        <th>Token Name</th>
        <th>Symbol</th>
        <th>Token Type</th>
        <th>Token Address</th>
        <th>Amount</th>
      </tr>
    </thead>
  );
}

export function List({ items }: { items: any[] }) {
  return (
    <table>
      <Header />
      <tbody>
        {items.map(
          ({
            tokenAddress,
            amount,
            tokenType,
            tokenNfts: { tokenId },
            token: { name, symbol },
          }) => (
            <Item
              key={tokenId}
              tokenAddress={tokenAddress}
              tokenId={tokenId}
              tokenType={tokenType}
              amount={amount}
              tokenName={name}
              tokenSymbol={symbol}
            />
          )
        )}
      </tbody>
    </table>
  );
}
