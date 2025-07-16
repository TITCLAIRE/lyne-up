import { useState, useRef, useCallback } from 'react';

export const useSessionTimer = (onComplete = null) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = useCallback((duration) => {
    setTotalDuration(duration);
    setTimeRemaining(duration);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          setIsRunning(false);
          
          // Appeler le callback de fin si fourni
          if (onComplete && typeof onComplete === 'function') {
            onComplete();
          }
          
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [onComplete]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeRemaining(0);
    setTotalDuration(0);
  }, [stopTimer]);

  const progress = totalDuration > 0 ? ((totalDuration - timeRemaining) / totalDuration) * 100 : 0;

  return {
    timeRemaining,
    totalDuration,
    isRunning,
    progress,
    startTimer,
    stopTimer,
    resetTimer,
  };
};