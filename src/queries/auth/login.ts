export const loginMutation = /* GraphQL */ `
  mutation LoginMutation {
    Login {
      id
      privyId
      userName
      name
      email
      walletAddress
      projectName
      communicationEmail
      telegramHandle
      isProfileCompleted
      isVerified
      credits {
        id
        type
        initialFreeCreditAllocatedTs
        isPaymentMethodAdded
        creditUsage {
          freeCreditsUsed
          totalFreeCredits
          lifetimeCreditsUsed
          lastUpdatedAt
          currentCycleCreditsUsed
        }
        keys {
          id
          key
          keyHash
          type
          status
          userId
          creditUsed
          updatedAt
        }
        subscription {
          id
          userId
          status
          collectionMethod
          startBillingTs
          nextBillingTs
          lastBillingTs
          cancelAtTs
          endedAtTs
          updatedAt
        }
      }
    }
  }
`;
