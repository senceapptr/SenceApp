import { useState, useEffect } from 'react';
import { formatTimeLeft } from '@/utils/timeUtils';

/**
 * Her saniye güncellenen sayaç hook'u
 * @param endDate Bitiş tarihi (ISO String veya Date)
 * @returns Formatlanmış süre metni
 */
export function useCountdown(endDate: string | Date | undefined) {
    const [timeLeft, setTimeLeft] = useState<string>('...');

    useEffect(() => {
        if (!endDate) return;

        // İlk hesaplama
        setTimeLeft(formatTimeLeft(endDate));

        // Her saniye güncelle
        const timer = setInterval(() => {
            setTimeLeft(formatTimeLeft(endDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    return timeLeft;
}
