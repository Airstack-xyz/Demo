export function Header() {
  return (
    <thead className="card-light !border-none sm:bg-fixed rounded-2xl">
      <tr className="[&>th]:text-xs [&>th]:font-bold [&>th]:text-left [&>th]:py-5 [&>th]:px-8 [&>th]:whitespace-nowrap">
        <th>ENS</th>
        <th>Primary ENS</th>
        <th>Wallet address</th>
        <th>Lens</th>
        <th>Farcaster</th>
        <th>XMTP </th>
      </tr>
    </thead>
  );
}
