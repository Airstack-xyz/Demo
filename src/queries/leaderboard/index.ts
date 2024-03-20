export const leadingProfileQuery = /* GraphQL */ `
  query LeadingProfiles {
    LeadingProfiles(input: { timeFrame: life_time }) {
      leadingProfiles {
        id
        fid
        timeFrom
        timeTo
        pointsEarned
        pointsEarnedFloat
        referrerBonusPointEarned
        referrerBonusPointEarnedFloat
        total
        totalFloat
        numberOfTransactions
      }
      pageInfo {
        nextCursor
      }
    }
  }
`;
