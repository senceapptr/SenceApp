/**
 * SenceApp Zaman Yönetimi Araçları
 */

export const formatTimeLeft = (endDate: string | Date): string => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Bitti';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days} gün ${hours} saat`;
  }
  if (hours > 0) {
    return `${hours} saat ${minutes} dakika`;
  }
  if (minutes > 0) {
    return `${minutes} dakika ${seconds} saniye`;
  }
  return `${seconds} saniye`;
};

/**
 * Detay sayfası için daha uzun ve açıklayıcı format
 */
export const formatTimeLeftLong = (endDate: string | Date): string => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Süre Doldu';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let parts = [];
  if (days > 0) parts.push(`${days} gün`);
  if (hours > 0) parts.push(`${hours} saat`);
  if (minutes > 0) parts.push(`${minutes} dakika`);
  if (days === 0) parts.push(`${seconds} saniye`); // Gün yoksa saniyeyi de ekle

  return parts.join(' ') + ' kaldı';
};
