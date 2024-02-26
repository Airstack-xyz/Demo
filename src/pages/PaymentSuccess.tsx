import { useEffect, useCallback, useMemo, useRef } from 'react';
import {
  CheckoutSessionPaymentStatus,
  CheckoutSessionStatus,
  GetCheckoutSessionStatusQuery
} from '../../__generated__/types';
import { useAuth } from '../hooks/useAuth';
import { SubscriptionPaymentStatusQuery } from '../queries/auth/subscriptionPaymentStatus';
import { showToast } from '../utils/showToast';
import { GetCheckoutSessionStatusQueryVariables } from '../../__generated__/types';
import { decode } from '../utils/encode';
import { useAppQuery } from '../hooks/useAppQuery';

const successToastMessage =
  'credit card successfully added. You are on builder plan now!';

const alertTimeout = 3000;
const pollingInterval = 3000;

export default function PaymentSuccess() {
  const errorCount = useRef(0);
  const { loggedIn, getUser } = useAuth();

  const origin = useMemo(() => {
    const origin =
      new URLSearchParams(window.location.search).get('_origin') || '';
    const url = decode(origin);
    return url;
  }, []);

  const [getStatus, { data }] = useAppQuery<
    GetCheckoutSessionStatusQuery,
    GetCheckoutSessionStatusQueryVariables
  >(SubscriptionPaymentStatusQuery);

  const id = useMemo(() => {
    return localStorage.getItem('subscriptionId') || '5';
  }, []);

  const redirectToOrigin = useCallback(
    (timeout = alertTimeout) => {
      setTimeout(() => {
        window.location.href = origin ? origin : '/';
      }, timeout);
    },
    [origin]
  );

  const handlePaymentComplete = useCallback(async () => {
    localStorage.removeItem('subscriptionId');
    await getUser();
    showToast(successToastMessage, 'positive', alertTimeout);
    redirectToOrigin();
  }, [getUser, redirectToOrigin]);

  const checkStatus = useCallback(
    async (id: string) => {
      const { data, error } = await getStatus({
        input: {
          id
        }
      });
      if (data?.GetCheckoutSessionStatus) {
        const status = data?.GetCheckoutSessionStatus?.status;
        const paymentStatus = data?.GetCheckoutSessionStatus?.paymentStatus;
        if (status) {
          if (
            paymentStatus === CheckoutSessionPaymentStatus.NoPaymentRequired ||
            paymentStatus === CheckoutSessionPaymentStatus.Paid
          ) {
            handlePaymentComplete();
            return;
          }
        }
      }

      if (error) {
        errorCount.current += 1;
      }

      if (errorCount.current > 5) {
        showToast(
          'Unable to verify payment, please try again later',
          'negative',
          alertTimeout
        );
        redirectToOrigin();
        return;
      }

      setTimeout(() => {
        checkStatus(id);
      }, pollingInterval);
    },
    [getStatus, handlePaymentComplete, redirectToOrigin]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = useRef<any>(null);
  useEffect(() => {
    if (id && loggedIn) {
      timeoutRef.current = setTimeout(() => {
        checkStatus(id);
      }, pollingInterval);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [loggedIn, checkStatus, id]);

  useEffect(() => {
    if (!id) {
      redirectToOrigin(0);
    }
  }, [id, redirectToOrigin]);

  const status = data?.GetCheckoutSessionStatus?.status;
  const paymentStatus = data?.GetCheckoutSessionStatus?.paymentStatus;

  let message = 'Please wait while we verify your payment.';
  if (status === CheckoutSessionStatus.Complete) {
    if (paymentStatus === CheckoutSessionPaymentStatus.Paid) {
      message = 'Payment complete, redirecting.';
    }
    if (paymentStatus === CheckoutSessionPaymentStatus.Unpaid) {
      message = 'Payment failed, redirecting.';
    }
  } else if (status === CheckoutSessionStatus.Expired) {
    message = 'Payment expired, redirecting.';
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <img
        alt="loader"
        src="/images/loaders/airstack-logo-loader.gif"
        width={50}
        height={50}
      />
      <h1 className="p-10 text-lg">{message}</h1>
    </div>
  );
}
