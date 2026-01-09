import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  label?: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, label = "Tippschluss in:" }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <div className="text-xs text-muted-foreground">
        Event hat begonnen
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1">
        <TimeUnit value={timeLeft.days} label="T" />
        <span className="text-muted-foreground text-xs">:</span>
        <TimeUnit value={timeLeft.hours} label="Std" />
        <span className="text-muted-foreground text-xs">:</span>
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <span className="text-muted-foreground text-xs">:</span>
        <TimeUnit value={timeLeft.seconds} label="Sek" />
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex items-baseline gap-0.5">
    <span className="bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded text-sm min-w-[24px] text-center">
      {value}
    </span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
  </div>
);

export default Countdown;
