export function ListTitle({ title }: { title: string }) {
  return (
    <div className="list-title">
      <img src="/public/sound-wave-bars.svg" height={15} width={15} />
      <h2>{title}</h2>
    </div>
  );
}
