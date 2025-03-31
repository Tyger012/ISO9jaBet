import { useState, useEffect, useRef } from 'react';

type CountdownReturnType = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  formatted: string;
};

export function useCountdown(targetDate: string | Date): CountdownReturnType {
  const parsedTarget = typeof targetDate === 'string' 
    ? new Date(targetDate)
    : targetDate;
    
  const calculateTimeLeft = (): CountdownReturnType => {
    const difference = parsedTarget.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: true,
        formatted: 'Started'
      };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Format as HH:MM:SS or DD:HH:MM:SS if days > 0
    let formatted = '';
    if (days > 0) {
      formatted = `${days.toString().padStart(2, '0')}:`;
    }
    
    formatted += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return {
      days,
      hours,
      minutes,
      seconds,
      isComplete: false,
      formatted
    };
  };
  
  const [timeLeft, setTimeLeft] = useState<CountdownReturnType>(calculateTimeLeft());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set initial value
    setTimeLeft(calculateTimeLeft());
    
    // Set interval
    intervalRef.current = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
      
      if (updatedTimeLeft.isComplete && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate]);
  
  return timeLeft;
}
