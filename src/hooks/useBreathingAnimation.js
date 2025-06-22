import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioManager } from './useAudioManager';

export const useBreathingAnimation = () => {
  const [breathingState, setBreathingState] = useState({
    phase: 'idle',
    progress: 0,
    counter: 0,
    instruction: 'Respirez naturellement',
    inhaleTime: 5,
    holdTime: 0,
    exhaleTime: 5,
    currentPattern: null
  });

  const intervalRef = useRef(null);
  const isRunningRef = useRef(false);
  const cycleStartRef = useRef(0);
  const lastPhaseRef = useRef('idle');
  const { updateBreathingState } = useAudioManager();

  const startBreathing = useCallback((rhythmOrPattern = '5-5') => {
    if (isRunningRef.current) return;
    
    console.log('Démarrage respiration avec pattern:', rhythmOrPattern);
    
    isRunningRef.current = true;
    cycleStartRef.current = Date.now();
    lastPhaseRef.current = 'idle';

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

    console.log('Paramètres respiratoires:', {
      inhale: inhaleTime / 1000,
      hold: holdTime / 1000,
      exhale: exhaleTime / 1000,
      totalCycle: totalCycle / 1000
    });

    // Informer le gestionnaire audio des paramètres respiratoires
    const breathingParams = {
      inhaleTime: inhaleTime / 1000,
      holdTime: holdTime / 1000,
      exhaleTime: exhaleTime / 1000,
      phase: 'idle'
    };
    updateBreathingState(breathingParams);

    const updateState = () => {
      if (!isRunningRef.current) return;

      const now = Date.now();
      const elapsed = now - cycleStartRef.current;
      const cycleTime = elapsed % totalCycle;

      let phase;
      let progress;
      let counter;
      let instruction;
      let timeUntilNextPhase = 0;

      if (cycleTime < inhaleTime) {
        phase = 'inhale';
        progress = (cycleTime / inhaleTime) * 100;
        counter = Math.ceil((inhaleTime - cycleTime) / 1000);
        instruction = 'Inspirez';
        timeUntilNextPhase = inhaleTime - cycleTime;
      } else if (holdTime > 0 && cycleTime < inhaleTime + holdTime) {
        phase = 'hold';
        const holdProgress = (cycleTime - inhaleTime) / holdTime;
        progress = 100;
        counter = Math.ceil((holdTime - (cycleTime - inhaleTime)) / 1000);
        instruction = 'Retenez';
        timeUntilNextPhase = (inhaleTime + holdTime) - cycleTime;
      } else {
        phase = 'exhale';
        const exhaleStart = inhaleTime + holdTime;
        const exhaleProgress = (cycleTime - exhaleStart) / exhaleTime;
        progress = (1 - exhaleProgress) * 100;
        counter = Math.ceil((exhaleTime - (cycleTime - exhaleStart)) / 1000);
        instruction = 'Expirez';
        timeUntilNextPhase = totalCycle - cycleTime;
      }

      progress = Math.max(0, Math.min(100, progress));
      counter = Math.max(1, counter);

      // Détecter les changements de phase avec timing précis
      if (phase !== lastPhaseRef.current) {
        console.log('Changement de phase:', lastPhaseRef.current, '→', phase);
        console.log('Temps jusqu\'à la prochaine phase:', Math.round(timeUntilNextPhase), 'ms');
        
        // Calculer la durée exacte de la phase actuelle
        let currentPhaseDuration;
        if (phase === 'inhale') {
          currentPhaseDuration = inhaleTime / 1000;
        } else if (phase === 'hold') {
          currentPhaseDuration = holdTime / 1000;
        } else if (phase === 'exhale') {
          currentPhaseDuration = exhaleTime / 1000;
        }
        
        console.log('Durée phase actuelle:', currentPhaseDuration, 'secondes');
        
        lastPhaseRef.current = phase;
      }

      const newState = {
        phase,
        progress,
        counter,
        instruction,
        inhaleTime: inhaleTime / 1000,
        holdTime: holdTime / 1000,
        exhaleTime: exhaleTime / 1000,
        currentPattern: rhythmOrPattern,
        timeUntilNextPhase: Math.round(timeUntilNextPhase)
      };

      setBreathingState(newState);

      // Mettre à jour l'état respiratoire pour le gestionnaire audio avec timing précis
      updateBreathingState({
        ...newState,
        phase,
        currentPhaseDuration: phase === 'inhale' ? inhaleTime / 1000 : 
                            phase === 'hold' ? holdTime / 1000 : 
                            exhaleTime / 1000
      });
    };

    intervalRef.current = setInterval(updateState, 50); // Plus fréquent pour plus de précision
    updateState();
  }, [updateBreathingState]);

  const stopBreathing = useCallback(() => {
    console.log('Arrêt respiration');
    isRunningRef.current = false;
    lastPhaseRef.current = 'idle';
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    const resetState = {
      phase: 'idle',
      progress: 0,
      counter: 0,
      instruction: 'Respirez naturellement',
      inhaleTime: 5,
      holdTime: 0,
      exhaleTime: 5,
      currentPattern: null,
      timeUntilNextPhase: 0
    };
    
    setBreathingState(resetState);
    
    // Informer le gestionnaire audio de l'arrêt
    updateBreathingState(resetState);
  }, [updateBreathingState]);

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