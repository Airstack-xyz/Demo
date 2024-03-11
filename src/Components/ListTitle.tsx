import { Image } from '@/Components/Image';

export function ListTitle({ title, icon }: { title: string; icon?: string }) {
  return (
    <div className="list-title">
      <Image src={`/icons/${icon}.svg`} height={20} width={20} />
      <h2>{title}</h2>
    </div>
  );
}
