import { useState, useRef, useCallback, useEffect } from 'react';

export const useBreathingAnimation = () => {
  const [breathingState, setBreathingState] = useState({
    phase: 'idle',
    progress: 0,
    counter: 0,
    instruction: 'Respirez naturellement',
    emoji: '🧘‍♀️',
    // NOUVEAU : Exposer les timings utilisés pour le debug
    currentPattern: null,
    inhaleTime: 0,
    holdTime: 0,
    exhaleTime: 0,
  });

  const intervalRef = useRef(null);
  const isRunningRef = useRef(false);
  const cycleStartRef = useRef(0);

  const startBreathing = useCallback((breathingPattern) => {
    if (isRunningRef.current) return;
    
    console.log('🫁 BREATHING START: Pattern reçu directement:', breathingPattern);
    
    // VALIDATION CRITIQUE DU PATTERN
    if (!breathingPattern || typeof breathingPattern !== 'object') {
      console.error('❌ ERREUR: Pattern respiratoire invalide:', breathingPattern);
      return;
    }
    
    if (!breathingPattern.inhale || !breathingPattern.exhale) {
      console.error('❌ ERREUR: Pattern incomplet:', breathingPattern);
      return;
    }
    
    console.log('✅ PATTERN VALIDÉ:', breathingPattern);
    console.log(`⏱️ Timings confirmés: ${breathingPattern.inhale}s inspiration, ${breathingPattern.hold || 0}s pause, ${breathingPattern.exhale}s expiration`);
    
    isRunningRef.current = true;
    cycleStartRef.current = Date.now();
    
    // Convertir en millisecondes
    const inhaleTime = breathingPattern.inhale * 1000;
    const holdTime = (breathingPattern.hold || 0) * 1000;
    const exhaleTime = breathingPattern.exhale * 1000;
    
    const totalCycle = inhaleTime + holdTime + exhaleTime;
    console.log(`⏱️ CYCLE EN MS: ${totalCycle}ms (${inhaleTime}ms + ${holdTime}ms + ${exhaleTime}ms)`);

    // VÉRIFICATION SPÉCIALE POUR KIDS
    if (breathingPattern.inhale === 4 && breathingPattern.exhale === 4) {
      console.log('👶 KIDS PATTERN CONFIRMÉ: 4s inspiration / 4s expiration');
    }

    const getInstructionText = (phase) => {
      // Détection automatique du mode enfants basée sur le pattern 4/4
      const isKidsMode = breathingPattern.inhale === 4 && breathingPattern.exhale === 4;
      
      if (isKidsMode) {
        switch (phase) {
          case 'inhale':
            return `Gonfle ton ballon magique (${breathingPattern.inhale}s)`;
          case 'hold':
            return `Garde l'air magique (${breathingPattern.hold}s)`;
          case 'exhale':
            return `Souffle comme le vent doux (${breathingPattern.exhale}s)`;
          default:
            return 'Respire comme un petit champion';
        }
      }
      
      // Instructions standard
      switch (phase) {
        case 'inhale':
          return `Inspirez (${breathingPattern.inhale}s)`;
        case 'hold':
          return `Retenez (${breathingPattern.hold}s)`;
        case 'exhale':
          return `Expirez (${breathingPattern.exhale}s)`;
        default:
          return 'Respirez naturellement';
      }
    };

    const getPhaseEmoji = (phase) => {
      // Détection automatique du mode enfants
      const isKidsMode = breathingPattern.inhale === 4 && breathingPattern.exhale === 4;
      
      if (isKidsMode) {
        switch (phase) {
          case 'inhale':
            return '🎈'; // Ballon qui se gonfle
          case 'hold':
            return '⭐'; // Étoile magique
          case 'exhale':
            return '🌸'; // Fleur qui s'ouvre
          default:
            return '🦄'; // Licorne magique
        }
      }
      
      // Emojis standard
      switch (phase) {
        case 'inhale':
          return '🌬️';
        case 'hold':
          return '⏸️';
        case 'exhale':
          return '💨';
        default:
          return '🧘‍♀️';
      }
    };

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
        // Phase d'inspiration
        phase = 'inhale';
        progress = (cycleTime / inhaleTime) * 100;
        counter = Math.ceil((inhaleTime - cycleTime) / 1000);
        instruction = getInstructionText('inhale');
        emoji = getPhaseEmoji('inhale');
      } else if (holdTime > 0 && cycleTime < inhaleTime + holdTime) {
        // Phase de rétention
        phase = 'hold';
        progress = 100; // Barre reste pleine pendant la rétention
        const holdElapsed = cycleTime - inhaleTime;
        counter = Math.ceil((holdTime - holdElapsed) / 1000);
        instruction = getInstructionText('hold');
        emoji = getPhaseEmoji('hold');
      } else {
        // Phase d'expiration
        phase = 'exhale';
        const exhaleElapsed = cycleTime - inhaleTime - holdTime;
        progress = 100 - (exhaleElapsed / exhaleTime) * 100;
        counter = Math.ceil((exhaleTime - exhaleElapsed) / 1000);
        instruction = getInstructionText('exhale');
        emoji = getPhaseEmoji('exhale');
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
        // NOUVEAU : Exposer les timings pour le debug
        currentPattern: breathingPattern,
        inhaleTime: breathingPattern.inhale,
        holdTime: breathingPattern.hold || 0,
        exhaleTime: breathingPattern.exhale,
      });
    };

    // Mettre à jour toutes les 100ms pour une animation fluide
    intervalRef.current = setInterval(updateState, 100);
    updateState(); // Premier appel immédiat
    
    // LOG FINAL DE CONFIRMATION
    console.log(`🚀 ANIMATION DÉMARRÉE AVEC PATTERN EXPLICITE:`, breathingPattern);
    
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
      currentPattern: null,
      inhaleTime: 0,
      holdTime: 0,
      exhaleTime: 0,
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