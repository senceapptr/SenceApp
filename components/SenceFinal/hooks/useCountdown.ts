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
        setTimeLeft(`${days} gün ${hours} saat`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} saat ${minutes} dakika`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes} dakika ${seconds} saniye`);
      } else {
        setTimeLeft(`${seconds} saniye`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return timeLeft;
}
