export function Header() {
  return (
    <thead className="card-light !border-none sm:bg-fixed rounded-2xl">
      <tr className="[&>th]:text-xs [&>th]:font-bold [&>th]:text-left [&>th]:py-5 [&>th]:px-2 [&>th]:whitespace-nowrap">
        <th>
          <span className="pl-4">Profile Image</span>
        </th>
        <th>Profile Name</th>
        <th className="w-16">FID</th>
        <th>Primary ENS</th>
        <th>ENS</th>
        <th className="w-36">Wallet address</th>
        <th className="w-40"> Last action taken </th>
      </tr>
    </thead>
  );
}
