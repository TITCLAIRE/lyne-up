import { useState, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export const useSessionTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const { setCurrentScreen, setSessionActive } = useAppStore();

  const startTimer = useCallback((duration) => {
    console.log(`⏰ TIMER START: Démarrage timer pour ${duration} secondes`);
    setTotalDuration(duration);
    setTimeRemaining(duration);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        
        // Log détaillé quand on approche de la fin
        if (newTime <= 5 && newTime > 0) {
          console.log(`⏰ TIMER COUNTDOWN: ${newTime} secondes restantes`);
        }
        
        if (newTime <= 0) {
          console.log('⏰ TIMER END: Timer terminé - newTime <= 0 détecté');
          console.log('⏰ TIMER END: Fin de session programmée');
          setIsRunning(false);
          setSessionActive(false);
          
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('⏰ TIMER END: Interval cleared');
          }
          
          // Rediriger vers l'écran de résultats après un délai
          setTimeout(() => {
            console.log('📊 TIMER END: Redirection vers les résultats');
            setCurrentScreen('results');
          }, 2000); // 2 secondes pour laisser le temps au message de fin
          
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [setCurrentScreen, setSessionActive]);

  const stopTimer = useCallback(() => {
    console.log('⏸️ TIMER STOP: Arrêt du timer demandé');
    console.log('⏸️ TIMER STOP: isRunning avant arrêt:', isRunning);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('⏸️ TIMER STOP: Interval cleared');
    }
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    console.log('🔄 TIMER RESET: Reset du timer demandé');
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