import { Icon, IconType } from '@/Components/Icon';

type Props = {
  icon: IconType;
  title: string;
};

export function HeadingWithIcon({ icon, title }: Props) {
  return (
    <div className="flex items-center">
      <Icon name={icon} height={18} width={18} />
      <span className="ml-1.5 mr-2.5 font-bold">{title}</span>
    </div>
  );
}
