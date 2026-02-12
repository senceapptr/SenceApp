const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const pluralize = (value: number, unit: 'gün' | 'saat' | 'dakika' | 'saniye') => `${value} ${unit}`;

export const formatLeagueRemaining = (endDateISO?: string | null, now: number = Date.now()) => {
  if (!endDateISO) {
    return 'Süresiz';
  }

  const endMs = new Date(endDateISO).getTime();
  if (Number.isNaN(endMs)) {
    return 'Süresiz';
  }

  const diff = endMs - now;
  if (diff <= 0) {
    return 'Süre doldu';
  }

  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((diff % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((diff % MINUTE_MS) / SECOND_MS);

  if (days > 0) {
    return `Bitmesine ${pluralize(days, 'gün')} ${pluralize(hours, 'saat')} kaldı`;
  }

  if (hours > 0) {
    return `Bitmesine ${pluralize(hours, 'saat')} ${pluralize(minutes, 'dakika')} kaldı`;
  }

  return `Bitmesine ${pluralize(minutes, 'dakika')} ${pluralize(seconds, 'saniye')} kaldı`;
};
