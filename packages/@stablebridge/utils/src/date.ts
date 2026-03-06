export function formatDate(iso: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const RELATIVE_TIME_UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
  ['second', 1],
];

export function formatRelativeTime(iso: string, locale = 'en-US'): string {
  const elapsed = (new Date(iso).getTime() - Date.now()) / 1_000;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  for (const [unit, seconds] of RELATIVE_TIME_UNITS) {
    if (Math.abs(elapsed) >= seconds || unit === 'second') {
      return formatter.format(Math.round(elapsed / seconds), unit);
    }
  }

  return formatter.format(0, 'second');
}
