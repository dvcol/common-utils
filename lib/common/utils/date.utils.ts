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
