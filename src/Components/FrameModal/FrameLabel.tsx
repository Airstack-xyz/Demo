import { Icon, IconType } from '../Icon';

export function FrameLabel({
  label,
  labelIcon,
  labelIconSize = 16
}: {
  label: string;
  labelIcon: IconType;
  labelIconSize?: number;
}) {
  return (
    <div className="flex items-center gap-1 mb-2">
      <Icon name={labelIcon} height={labelIconSize} width={labelIconSize} />
      <span className="text-text-secondary text-xs font-semibold">{label}</span>
    </div>
  );
}
