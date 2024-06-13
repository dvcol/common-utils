export const CacheRetention = {
  /** 1 hour */
  Hour: 60 * 60 * 1000,
  /** 1 day */
  Day: 24 * 60 * 60 * 1000,
  /** 1 week */
  Week: 7 * 24 * 60 * 60 * 1000,
  /** 1 month */
  Month: 31 * 24 * 60 * 60 * 1000,
  /** 1 year */
  Year: 365 * 24 * 60 * 60 * 1000,
} as const;
