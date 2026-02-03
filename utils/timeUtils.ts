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

    // Kısa format: Gün varsa saniyeyi gösterme (yer kazanmak için), gün yoksa saniyeye kadar göster
    if (days > 0) {
        return `${days}g ${hours}s ${minutes}dk`;
    }
    if (hours > 0) {
        return `${hours}s ${minutes}dk ${seconds}sn`;
    }
    if (minutes > 0) {
        return `${minutes}dk ${seconds}sn`;
    }
    return `${seconds}sn`;
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
