export const ENCODED_AUDIENCE = {
    FARCASTER: "1",
    ALL: "2",
  };
  
  export const DECODED_AUDIENCE: Record<string, string> = {
    "1": "farcaster",
    "2": "all",
  };
  
  export const ENCODED_CRITERIA = {
    UNIQUE_WALLETS: "1",
    TOTAL_MINTS: "2",
  };
  
  export const DECODED_CRITERIA: Record<string, string> = {
    "1": "unique_wallets",
    "2": "total_mints",
  };
  
  export const ENCODED_TIME_FRAME = {
    ONE_HOUR: "1",
    TWO_HOURS: "2",
    EIGHT_HOURS: "3",
    ONE_DAY: "4",
    TWO_DAYS: "5",
    SEVEN_DAYS: "6",
  };
  
  export const DECODED_TIME_FRAME: Record<string, string> = {
    "1": "one_hour",
    "2": "two_hours",
    "3": "eight_hours",
    "4": "one_day",
    "5": "two_days",
    "6": "seven_days",
  };