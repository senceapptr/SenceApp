import { useState, useEffect } from 'react';

export function useCountdown(endDate: string) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const end = new Date(endDate).getTime();
            const now = new Date().getTime();
            const difference = end - now;

            if (difference <= 0) {
                setTimeLeft('Sona erdi');
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeLeft(`${days}g ${hours}s ${minutes}d`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}s ${minutes}d ${seconds}sn`);
            } else {
                setTimeLeft(`${minutes}d ${seconds}sn`);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    return timeLeft;
}
