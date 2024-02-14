import classnames from 'classnames';

const defaultAvatar = '/images/user_skeleton.svg';

export function PlanBadge({
  freeTrialActive,
  isSubscriptionActive,
  className
}: {
  freeTrialActive: boolean;
  isSubscriptionActive: boolean;
  className: string;
}) {
  return (
    <span
      className={classnames(
        'text-xs mt-0.5 bg-text-secondary text-white rounded-full px-1.5 font-normal',
        className,
        {
          '!bg-[#B5DE3F] !text-secondary ':
            isSubscriptionActive || freeTrialActive
        }
      )}
    >
      {isSubscriptionActive
        ? 'builder'
        : freeTrialActive
        ? 'free trial'
        : 'no plan'}
    </span>
  );
}

export function ProfileAvatar({
  userName,
  freeTrialActive,
  isSubscriptionActive
}: {
  userName: string;
  freeTrialActive: boolean;
  isSubscriptionActive: boolean;
}) {
  return (
    <div
      className="flex justify-center items-center cursor-default"
      data-loader-type="block"
    >
      <img
        width={30}
        height={30}
        className="rounded-full mr-2"
        src={defaultAvatar}
      />
      <span className="text-sm flex flex-col items-start">
        <span>{userName}</span>
        <PlanBadge
          className="!text-[8px]"
          freeTrialActive={freeTrialActive}
          isSubscriptionActive={isSubscriptionActive}
        />
      </span>
    </div>
  );
}
