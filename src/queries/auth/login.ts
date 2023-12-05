export const LoginMutation = `
  mutation LoginMutation {
    Login {
      id
      email
      name
      userName
      isVerified
      projectName
      walletAddress
      telegramHandle
      communicationEmail
      isProfileCompleted
      credits {
        id
        type
        createdAt
        updatedAt
        isPaymentMethodAdded
        initialFreeCreditAllocatedTs
        subscription {
          id
          status
          updatedAt
          endedAtTs
          createdAt
          cancelAtTs
          lastBillingTs
          nextBillingTs
          startBillingTs
          collectionMethod
        }
        keys {
          id
          key
          type
          status
          keyHash
          createdAt
          updatedAt
          usage {
            lastUpdatedAt
            freeCreditsUsed
            totalFreeCredits
            lifetimeCreditsUsed
            currentCycleCreditsUsed
          }
        }
      }
    }
  }
`;
