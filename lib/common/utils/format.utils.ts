import prettyBytes from 'pretty-bytes';

export const computeProgress = (downloaded: number | any, size: number | any): number => {
  const numDownloaded = Number(downloaded);
  const numSize = Number(size);
  if (numDownloaded && Number.isFinite(numDownloaded) && numSize && Number.isFinite(numSize)) {
    const progress = Math.floor((numDownloaded / numSize) * 100);
    return Number.isFinite(progress) ? progress : 0;
  }
  return 0;
};

export type Time = { years: number; months: number; days: number; hours: number; minutes: number; seconds: number };

export const formatTimeShort = ({ years, months, days, hours, minutes, seconds }: Time, separator = ':'): string => {
  const hms = [];
  hms.push(hours.toString().padStart(2, '0'));
  hms.push(minutes.toString().padStart(2, '0'));
  hms.push(seconds.toString().padStart(2, '0'));

  if (!years && !months && !days) return hms.join(separator);

  const ymd = [];
  ymd.push(years.toString().padStart(2, '0'));
  ymd.push(months.toString().padStart(2, '0'));
  ymd.push(days.toString().padStart(2, '0'));

  return `${ymd.join(separator)}-${hms.join(separator)}`;
};

export const formatTimeLong = ({ years, months, days, hours, minutes, seconds }: Time): string => {
  const parts = [];

  if (years) parts.push(`${years}y`);
  if (months || years) parts.push(`${months ?? 0}m`);
  if (days || years || months) parts.push(`${days ?? 0}d`);
  if (hours || years || months || days) parts.push(`${hours ?? 0}h`);
  if (minutes || years || months || days || hours) parts.push(`${minutes ?? 0}m`);
  parts.push(`${seconds ?? 0}s`);

  return parts.join(' ');
};

export const InSeconds = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7,
  month: 60 * 60 * 24 * (365 / 12),
  year: 60 * 60 * 24 * 365,
} as const;

export const formatHMS = (s: number): Time => {
  const hours = Math.floor(s / InSeconds.hour);
  const minutes = Math.floor((s % InSeconds.minute) / InSeconds.minute);
  const seconds = s % InSeconds.minute;

  return { years: 0, months: 0, days: 0, hours, minutes, seconds };
};

export const formatYMD = (s: number): Time => {
  let remaining = 0;
  const years = Math.floor(s / InSeconds.year);
  remaining = s % InSeconds.year;

  const months = Math.floor(remaining / InSeconds.month);
  remaining %= InSeconds.month;

  const days = Math.floor(remaining / InSeconds.day);
  remaining %= InSeconds.day;

  return { ...formatHMS(remaining), years, months, days };
};

export const formatTime = (s: number, format: 'short' | 'long' | 'ymd' | 'raw' = 'short'): Time | string => {
  if (format === 'short') return formatTimeShort(formatHMS(s));
  if (format === 'long') return formatTimeLong(formatHMS(s));
  if (format === 'ymd') return formatTimeLong(formatYMD(s));
  return formatYMD(s);
};

export const formatBytes = (byte: number | any): string => {
  const num = Number(byte);
  if (num && Number.isFinite(num)) {
    return prettyBytes(num);
  }
  return '0 B';
};
