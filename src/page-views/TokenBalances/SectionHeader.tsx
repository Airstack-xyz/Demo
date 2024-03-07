import { Icon, IconType } from '../../Components/Icon';

export function SectionHeader({
  iconName,
  heading
}: {
  iconName: IconType;
  heading: string;
}) {
  return (
    <div className="flex items-center font-bold">
      <Icon name={iconName} className="h-5 mr-1.5" />
      <span className="ellipsis">{heading}</span>
    </div>
  );
}
