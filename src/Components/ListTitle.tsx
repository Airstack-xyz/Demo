export function ListTitle({ title, icon }: { title: string; icon?: string }) {
  return (
    <div className="list-title">
      <img src={`/icons/${icon}.svg`} height={20} width={20} />
      <h2>{title}</h2>
    </div>
  );
}
