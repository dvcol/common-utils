import type { RecursiveRecord, RecursiveType } from '~/common/models/typescript.model';

/**
 * Compute elapsed time between two dates
 * @param endDate
 * @param startDate
 */
export const elapsedTime = (endDate: Date, startDate = new Date()): number => {
  return (endDate.getTime() - startDate.getTime()) / 1000;
};

export class DateUtils {
  static clone = (date: Date) => new Date(date);

  static next(days = 1, date?: Date, coefficient = 1) {
    const _date = date ? this.clone(date) : new Date();
    _date.setDate(_date.getDate() + days * coefficient);
    return _date;
  }

  static previous(days = 1, date?: Date, coefficient = 1) {
    return this.next(days, date, -coefficient);
  }

  static weeks = {
    previous: (weeks = 1, date?: Date) => this.previous(weeks, date, 7),
    next: (weeks = 1, date?: Date) => this.next(weeks, date, 7),
  };
}

export const toDateObject = <T extends RecursiveRecord<string>>(record?: T): RecursiveType<T, Date> | undefined => {
  if (!record) return undefined;
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      if (typeof value === 'string') return [key, new Date(value)];
      if (typeof value === 'object') return [key, toDateObject(value)];
      return [key, value];
    }),
  );
};

const isDate = (value: unknown): value is Date => value instanceof Date;

export const compareDateObject = <T extends RecursiveRecord<Date>>(a?: T, b?: T): RecursiveType<T, boolean> => {
  if (!a || !b) throw new Error('Cannot compare undefined objects');
  return Object.fromEntries(
    Object.keys(a).map(key => {
      const _key: keyof RecursiveRecord<Date> = key as keyof RecursiveRecord<Date>;
      if (a && b) {
        const aValue = a[_key];
        const bValue = b[_key];
        if (isDate(aValue) && isDate(bValue)) return [_key, aValue.getTime() !== bValue.getTime()];
        if (!isDate(aValue) && !isDate(bValue)) return [_key, compareDateObject(aValue, bValue)];
      }
      return [_key, a !== b];
    }),
  );
};

export const shortTime = (date?: Date, locale?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions) =>
  date?.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', ...options });

export const DayOfWeek = {
  Sunday: 'Sunday',
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
} as const;

export const DayOfWeekToNumber = {
  [DayOfWeek.Sunday]: 0,
  [DayOfWeek.Monday]: 1,
  [DayOfWeek.Tuesday]: 2,
  [DayOfWeek.Wednesday]: 3,
  [DayOfWeek.Thursday]: 4,
  [DayOfWeek.Friday]: 5,
  [DayOfWeek.Saturday]: 6,
} as const;

export const NumberToDayOfWeek = {
  0: DayOfWeek.Sunday,
  1: DayOfWeek.Monday,
  2: DayOfWeek.Tuesday,
  3: DayOfWeek.Wednesday,
  4: DayOfWeek.Thursday,
  5: DayOfWeek.Friday,
  6: DayOfWeek.Saturday,
} as const;

export const dayOfTheWeek = (date: Date | string | number) => {
  const day = new Date(date).getDay();
  return NumberToDayOfWeek[day];
};

export const getTodayISOLocal = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString();

export type TimeSinceUnit = 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds';

export type TimeSinceResult = Record<TimeSinceUnit, number>;

export function timeSince(date: Date | number | string): TimeSinceResult {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30)); // approx month
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365)); // approx year

  return { seconds, minutes, hours, days, months, years };
}

/**
 * Format a date to a human-readable string indicating how long ago it was
 * @param date - The date to format, can be a Date object, timestamp, or ISO string
 * @param short - If true, returns a shorter format (e.g., "2h" instead of "2 hours")
 * @param units - Supported units for time difference, in order of preference
 */
export function timeAgo(
  date: Date | number | string,
  {
    short = false,
    units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'],
  }: {
    short?: boolean;
    units?: TimeSinceUnit[];
  } = {},
): string {
  const diff = timeSince(date);

  const found = units.find(u => diff[u] > 0);
  if (!found) return 'now';

  const value = diff[found];
  if (short) return `${value}${found.slice(0, 1)}`;
  const unit = found.slice(0, -1); // remove 's' for singular form and re-add below if needed
  return `${value} ${unit}${value > 1 ? 's' : ''} ago`;
}
