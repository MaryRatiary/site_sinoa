import React, { useState, useEffect } from 'react';

const CountdownBanner = ({ endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(endDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="w-full bg-gradient-to-r from-dark-500 via-accent-600 to-dark-500 overflow-hidden">
      <div className="h-5 sm:h-6 flex items-center justify-center gap-2 sm:gap-3 px-4">
        <span className="text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          ⌛ Offre limitée:
        </span>
        <div className="flex gap-1 sm:gap-1.5 items-center">
          <span className="text-white text-[9px] sm:text-[10px] font-mono font-bold bg-primary-500 px-1.5 sm:px-2 py-0.5 rounded min-w-6 sm:min-w-7 text-center">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-primary-400 text-[9px] sm:text-[10px] font-bold">:</span>
          <span className="text-white text-[9px] sm:text-[10px] font-mono font-bold bg-primary-500 px-1.5 sm:px-2 py-0.5 rounded min-w-6 sm:min-w-7 text-center">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-primary-400 text-[9px] sm:text-[10px] font-bold">:</span>
          <span className="text-white text-[9px] sm:text-[10px] font-mono font-bold bg-primary-500 px-1.5 sm:px-2 py-0.5 rounded min-w-6 sm:min-w-7 text-center">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;
