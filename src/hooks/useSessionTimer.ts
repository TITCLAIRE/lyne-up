import { useState, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export const useSessionTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { setCurrentScreen, setSessionActive } = useAppStore();

  const startTimer = useCallback((duration: number) => {
    console.log(`⏰ Démarrage timer: ${duration} secondes`);
    setTotalDuration(duration);
    setTimeRemaining(duration);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          console.log('⏰ Timer terminé - Fin de session');
          setIsRunning(false);
          setSessionActive(false);
          
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Rediriger vers l'écran de résultats après un délai
          setTimeout(() => {
            console.log('📊 Redirection vers les résultats');
            setCurrentScreen('results');
          }, 2000); // 2 secondes pour laisser le temps au message de fin
          
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [setCurrentScreen, setSessionActive]);

  const stopTimer = useCallback(() => {
    console.log('⏸️ Arrêt du timer');
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    console.log('🔄 Reset du timer');
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