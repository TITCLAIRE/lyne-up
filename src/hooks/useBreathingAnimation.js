import { useState, useRef, useCallback, useEffect } from 'react';

export const useBreathingAnimation = () => {
  const [breathingState, setBreathingState] = useState({
    phase: 'idle',
    progress: 0,
    counter: 0,
    instruction: 'Respirez naturellement',
    emoji: '🧘‍♀️',
    inhaleTime: 5,
    holdTime: 0,
    exhaleTime: 5,
    currentPattern: null
  });

  const intervalRef = useRef(null);
  const isRunningRef = useRef(false);
  const cycleStartRef = useRef(0);

  const startBreathing = useCallback((rhythmOrPattern = '5-5') => {
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    cycleStartRef.current = Date.now();

    let inhaleTime = 5000;
    let exhaleTime = 5000;
    let holdTime = 0;
    
    if (typeof rhythmOrPattern === 'object' && rhythmOrPattern !== null) {
      inhaleTime = (rhythmOrPattern.inhale || 5) * 1000;
      exhaleTime = (rhythmOrPattern.exhale || 5) * 1000;
      holdTime = (rhythmOrPattern.hold || 0) * 1000;
    } else if (typeof rhythmOrPattern === 'string') {
      if (rhythmOrPattern === '4-6') {
        inhaleTime = 4000;
        exhaleTime = 6000;
      } else if (rhythmOrPattern === '5-5') {
        inhaleTime = 5000;
        exhaleTime = 5000;
      }
    }

    const totalCycle = inhaleTime + holdTime + exhaleTime;

    const updateState = () => {
      if (!isRunningRef.current) return;

      const now = Date.now();
      const elapsed = now - cycleStartRef.current;
      const cycleTime = elapsed % totalCycle;

      let phase;
      let progress;
      let counter;
      let instruction;
      let emoji;

      if (cycleTime < inhaleTime) {
        phase = 'inhale';
        progress = (cycleTime / inhaleTime) * 100;
        counter = Math.ceil((inhaleTime - cycleTime) / 1000);
        instruction = 'Inspirez';
        emoji = '🌬️';
      } else if (holdTime > 0 && cycleTime < inhaleTime + holdTime) {
        phase = 'hold';
        const holdProgress = (cycleTime - inhaleTime) / holdTime;
        progress = 100;
        counter = Math.ceil((holdTime - (cycleTime - inhaleTime)) / 1000);
        instruction = 'Retenez';
        emoji = '⏸️';
      } else {
        phase = 'exhale';
        const exhaleStart = inhaleTime + holdTime;
        const exhaleProgress = (cycleTime - exhaleStart) / exhaleTime;
        progress = (1 - exhaleProgress) * 100;
        counter = Math.ceil((exhaleTime - (cycleTime - exhaleStart)) / 1000);
        instruction = 'Expirez';
        emoji = '💨';
      }

      progress = Math.max(0, Math.min(100, progress));
      counter = Math.max(1, counter);

      setBreathingState({
        phase,
        progress,
        counter,
        instruction,
        emoji,
        inhaleTime: inhaleTime / 1000,
        holdTime: holdTime / 1000,
        exhaleTime: exhaleTime / 1000,
        currentPattern: rhythmOrPattern
      });
    };

    intervalRef.current = setInterval(updateState, 100);
    updateState();
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
      inhaleTime: 5,
      holdTime: 0,
      exhaleTime: 5,
      currentPattern: null
    });
  }, []);

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