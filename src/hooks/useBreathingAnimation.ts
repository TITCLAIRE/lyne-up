import { useState, useRef, useCallback, useEffect } from 'react';
import { BreathingState } from '../components/BreathingGuide';

export const useBreathingAnimation = () => {
  const [breathingState, setBreathingState] = useState<BreathingState>({
    phase: 'idle',
    progress: 0,
    counter: 0,
    instruction: 'Respirez naturellement',
    emoji: '🧘‍♀️',
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);
  const cycleStartRef = useRef<number>(0);

  const startBreathing = useCallback((rhythm: string = '5-5') => {
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    cycleStartRef.current = Date.now();

    // Déterminer les temps selon le rythme
    let inhaleTime = 5000; // 5 secondes en ms
    let exhaleTime = 5000; // 5 secondes en ms
    
    if (rhythm === '4-6') {
      inhaleTime = 4000;
      exhaleTime = 6000;
    }

    const totalCycle = inhaleTime + exhaleTime;

    const updateState = () => {
      if (!isRunningRef.current) return;

      const now = Date.now();
      const elapsed = now - cycleStartRef.current;
      const cycleTime = elapsed % totalCycle;

      let phase: 'inhale' | 'exhale';
      let progress: number;
      let counter: number;
      let instruction: string;
      let emoji: string;

      if (cycleTime < inhaleTime) {
        // Phase d'inspiration
        phase = 'inhale';
        progress = (cycleTime / inhaleTime) * 100;
        counter = Math.ceil((inhaleTime - cycleTime) / 1000);
        instruction = 'Inspirez';
        emoji = '🌬️';
      } else {
        // Phase d'expiration
        phase = 'exhale';
        const exhaleProgress = (cycleTime - inhaleTime) / exhaleTime;
        progress = (1 - exhaleProgress) * 100;
        counter = Math.ceil((exhaleTime - (cycleTime - inhaleTime)) / 1000);
        instruction = 'Expirez';
        emoji = '💨';
      }

      // S'assurer que les valeurs sont dans les bonnes limites
      progress = Math.max(0, Math.min(100, progress));
      counter = Math.max(1, counter);

      setBreathingState({
        phase,
        progress,
        counter,
        instruction,
        emoji,
      });
    };

    // Mettre à jour toutes les 100ms pour une animation fluide
    intervalRef.current = setInterval(updateState, 100);
    updateState(); // Premier appel immédiat
  }, []);

  const stopBreathing = useCallback(() => {
    isRunningRef.current = false;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setBreathingState({
      phase: 'idle',
      progress: 0,
      counter: 0,
      instruction: 'Respirez naturellement',
      emoji: '🧘‍♀️',
    });
  }, []);

  // Nettoyage à la destruction
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    breathingState,
    startBreathing,
    stopBreathing,
  };
};