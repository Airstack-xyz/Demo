import ROUTES, { APP_BASE_URL } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { Popover } from './Popover';
import { ProfileAvatar } from './ProfileAvatar';

const options = [
  {
    label: 'Profile Settings',
    href: APP_BASE_URL + ROUTES.profilesSettings + '/profile'
  },
  {
    label: 'Wallet',
    href: APP_BASE_URL + ROUTES.profilesSettings + '/manage-wallet'
  },
  {
    label: 'API Keys',
    href: APP_BASE_URL + ROUTES.profilesSettings + '/api-keys'
  },
  {
    label: 'Manage Plan',
    href: APP_BASE_URL + ROUTES.profilesSettings + '/manage-plan'
  },
  {
    label: 'Usage Details',
    href: APP_BASE_URL + ROUTES.profilesSettings + '/usage-details'
  }
] as const;

const MAX_NAME_LENGTH = 20;

export function Profile() {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  const prodCredit = user?.credits?.[0];
  const subscription = prodCredit?.subscription;
  const isSubscriptionActive =
    subscription?.status === 'active' || subscription?.status === 'past_due';
  const prodKeyUsage = prodCredit?.creditUsage;
  const freeCreditUsed = prodKeyUsage?.freeCreditsUsed || 0;
  const totalFreeCredits = prodKeyUsage?.totalFreeCredits || 0;
  const subscriptionEnded = subscription?.status === 'canceled';
  const usedFreeTrial = Boolean(prodCredit?.initialFreeCreditAllocatedTs);
  const _creditUsePercentage = (freeCreditUsed / totalFreeCredits) * 100 || 0;
  const creditUsePercentage = parseFloat(_creditUsePercentage.toFixed(2));
  const freeCreditConsumed =
    // if free trial was not used and subscription ended, consider it as free credits consumed.
    // this will make sure all the views are correctly shown
    !usedFreeTrial && subscriptionEnded
      ? true
      : usedFreeTrial
      ? creditUsePercentage >= 100
      : false;
  const freeTrialActive = !freeCreditConsumed && usedFreeTrial;

  const name = user?.name || user?.userName || 'Unknown User';
  const userName =
    name.length > MAX_NAME_LENGTH
      ? name.slice(0, MAX_NAME_LENGTH) + '...'
      : name;

  return (
    <Popover
      openOnHover
      className="p-0"
      anchor={
        <ProfileAvatar
          userName={userName}
          isSubscriptionActive={isSubscriptionActive}
          freeTrialActive={freeTrialActive}
        />
      }
    >
      <div className="flex flex-col w-36 mt-2 text-xs font-medium card rounded-md">
        {options.map(option => (
          <a
            target="_blank"
            key={option.href}
            href={option.href}
            className="p-3.5 hover:bg-black hover:bg-opacity-15"
          >
            {option.label}
          </a>
        ))}
        <hr className="mx-3.5 border-[#303241] border-t border-solid" />
        <a
          className="p-3.5 hover:bg-black hover:bg-5"
          href={APP_BASE_URL + ROUTES.pricing}
          target="_blank"
        >
          <button>Pricing</button>
        </a>
        <button
          onClick={handleLogout}
          className="text-text-error text-left p-3.5 hover:bg-black hover:bg-opacity-15"
        >
          Sign Out
        </button>
      </div>
    </Popover>
  );
}
