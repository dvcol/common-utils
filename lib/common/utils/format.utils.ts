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

export type Time = { hours: number; minutes: number; seconds: number };

export const formatTimeShort = ({ hours, minutes, seconds }: Time, separator = ':'): string =>
  [hours ? hours.toString().padStart(2, '0') : undefined, minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')]
    .filter(Boolean)
    .join(separator);

export const formatTimeLong = ({ hours, minutes, seconds }: Time): string => {
  return [
    hours ? `${hours.toString().padStart(2, '0')}h` : '',
    hours ? `${minutes.toString().padStart(2, '0')}m` : `${minutes.toString().padStart(2, '0')}`,
    `${seconds}s`,
  ].join(' ');
};

export const formatTime = (s: number, format: 'short' | 'long' | 'raw' = 'short'): Time | string => {
  const hours = Math.floor(s / (60 * 60));
  const minutes = Math.floor(s / 60) - hours * 60;
  const seconds = Math.floor(s) - hours * 60 * 60 - minutes * 60;
  if (format === 'short') return formatTimeShort({ hours, minutes, seconds });
  if (format === 'long') return formatTimeLong({ hours, minutes, seconds });
  return { hours, minutes, seconds };
};

export const formatBytes = (byte: number | any): string => {
  const num = Number(byte);
  if (num && Number.isFinite(num)) {
    return prettyBytes(num);
  }
  return '0 B';
};
