export function Header({
  isERC20,
  isCombination
}: {
  isERC20: boolean;
  isCombination: boolean;
}) {
  return (
    <thead className="bg-glass-grad !bg-fixed rounded-2xl">
      <tr className="[&>th]:text-xs [&>th]:font-bold [&>th]:text-left [&>th]:py-5 [&>th]:px-2 [&>th]:whitespace-nowrap">
        <th className="!pl-9">Token</th>
        <th>Wallet address</th>
        {!isCombination && <th>{isERC20 ? 'Amount' : 'Token ID'}</th>}
        <th>Primary ENS</th>
        <th>ENS</th>
        <th>Lens</th>
        <th>Farcaster</th>
        <th>XMTP </th>
      </tr>
    </thead>
  );
}
