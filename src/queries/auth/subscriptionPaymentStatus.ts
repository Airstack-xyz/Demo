export const SubscriptionPaymentStatusQuery = /* GraphQL */ `
  query GetCheckoutSessionStatus($input: CheckoutSessionInput!) {
    GetCheckoutSessionStatus(input: $input) {
      status
      paymentStatus
      id
    }
  }
`;
