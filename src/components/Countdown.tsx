import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface CountdownProps {
  targetDate: Date;
  label?: string;
  showUrgency?: boolean; // Show urgent styling when < 24h
  hasPrediction?: boolean; // Whether user has already predicted
}

const Countdown: React.FC<CountdownProps> = ({ 
  targetDate, 
  label = "Tippschluss in:", 
  showUrgency = false,
  hasPrediction = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true, totalHours: 0 };
    }

    const totalHours = difference / (1000 * 60 * 60);

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
      totalHours
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

  // Determine urgency level
  const isUrgent = showUrgency && !hasPrediction && timeLeft.totalHours <= 24;
  const isVeryUrgent = showUrgency && !hasPrediction && timeLeft.totalHours <= 6;
  const isCritical = showUrgency && !hasPrediction && timeLeft.totalHours <= 2;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        {isUrgent && (
          <AlertTriangle className={`w-3 h-3 ${
            isCritical ? 'text-red-500 animate-pulse' : 
            isVeryUrgent ? 'text-orange-500' : 
            'text-amber-500'
          }`} />
        )}
        <p className={`text-xs ${
          isCritical ? 'text-red-500 font-semibold' :
          isVeryUrgent ? 'text-orange-500 font-medium' :
          isUrgent ? 'text-amber-500' :
          'text-muted-foreground'
        }`}>
          {isUrgent ? 'Noch nicht getippt!' : label}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <TimeUnit value={timeLeft.days} label="T" urgent={isUrgent} veryUrgent={isVeryUrgent} critical={isCritical} />
        <span className={`text-xs ${isUrgent ? (isCritical ? 'text-red-400' : isVeryUrgent ? 'text-orange-400' : 'text-amber-400') : 'text-muted-foreground'}`}>:</span>
        <TimeUnit value={timeLeft.hours} label="Std" urgent={isUrgent} veryUrgent={isVeryUrgent} critical={isCritical} />
        <span className={`text-xs ${isUrgent ? (isCritical ? 'text-red-400' : isVeryUrgent ? 'text-orange-400' : 'text-amber-400') : 'text-muted-foreground'}`}>:</span>
        <TimeUnit value={timeLeft.minutes} label="Min" urgent={isUrgent} veryUrgent={isVeryUrgent} critical={isCritical} />
        <span className={`text-xs ${isUrgent ? (isCritical ? 'text-red-400' : isVeryUrgent ? 'text-orange-400' : 'text-amber-400') : 'text-muted-foreground'}`}>:</span>
        <TimeUnit value={timeLeft.seconds} label="Sek" urgent={isUrgent} veryUrgent={isVeryUrgent} critical={isCritical} />
      </div>
    </div>
  );
};

interface TimeUnitProps {
  value: number;
  label: string;
  urgent?: boolean;
  veryUrgent?: boolean;
  critical?: boolean;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label, urgent, veryUrgent, critical }) => (
  <div className="flex items-baseline gap-0.5">
    <span className={`font-bold px-1.5 py-0.5 rounded text-sm min-w-[24px] text-center ${
      critical ? 'bg-red-500/20 text-red-500' :
      veryUrgent ? 'bg-orange-500/20 text-orange-500' :
      urgent ? 'bg-amber-500/20 text-amber-500' :
      'bg-primary/10 text-primary'
    }`}>
      {value}
    </span>
    <span className={`text-[10px] ${
      critical ? 'text-red-400' :
      veryUrgent ? 'text-orange-400' :
      urgent ? 'text-amber-400' :
      'text-muted-foreground'
    }`}>{label}</span>
  </div>
);

export default Countdown;
