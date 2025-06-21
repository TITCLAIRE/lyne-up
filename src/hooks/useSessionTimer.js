import { useState, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export const useSessionTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const { setCurrentScreen, setSessionActive } = useAppStore();

  const startTimer = useCallback((duration) => {
    setTotalDuration(duration);
    setTimeRemaining(duration);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          setIsRunning(false);
          setSessionActive(false);
          
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          setTimeout(() => {
            setCurrentScreen('results');
          }, 2000);
          
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [setCurrentScreen, setSessionActive]);

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