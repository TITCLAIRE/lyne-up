import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

const frequencies = {
  coherence: { base: 256, beat: 0.1, name: 'Cohérence 0.1Hz' },
  '396hz': { base: 396, beat: 5, name: 'Libération 396Hz' },
  '432hz': { base: 432, beat: 8, name: 'Harmonie Naturelle 432Hz' },
  '528hz': { base: 528, beat: 6, name: 'Amour & Guérison 528Hz' },
  '639hz': { base: 639, beat: 7, name: 'Relations 639Hz' },
  '741hz': { base: 741, beat: 9, name: 'Éveil de l\'Intuition 741Hz' },
  '852hz': { base: 852, beat: 10, name: 'Retour à l\'Ordre Spirituel 852Hz' },
  '174hz': { base: 174, beat: 3, name: 'Fréquence de la Terre 174Hz' },
  '285hz': { base: 285, beat: 4, name: 'Régénération Cellulaire 285Hz' },
  theta: { base: 200, beat: 4.5, name: 'Ondes Theta (4.5Hz)' },
  theta6: { base: 200, beat: 6, name: 'Ondes Theta (6Hz)' },
  theta783: { base: 200, beat: 7.83, name: 'Ondes Theta (7.83Hz)' },
  alpha: { base: 300, beat: 10, name: 'Ondes Alpha (10Hz)' },
  beta: { base: 400, beat: 14, name: 'Ondes Beta (14Hz)' },
  delta: { base: 150, beat: 2, name: 'Ondes Delta (2Hz)' },
  gamma: { base: 500, beat: 40, name: 'Ondes Gamma (30-100Hz)' },
};

const sessionFrequencies = {
  // COHÉRENCE CARDIAQUE INTÉGRATIVE
  coherence: 'coherence',        // 0.1 Hz

  // URGENCE & RÉALIGNEMENT
  switch: '396hz',               // 396 Hz - Libération
  reset: 'theta',                // Ondes Theta 4.5 Hz

  // INITIATION & PERFECTIONNEMENT
  progressive: 'alpha',          // Ondes Alpha 10 Hz (TRAINING)
  free: '432hz',                 // 432 Hz - Harmonie Naturelle (SESSION LIBRE)

  // ESPACE ENFANTS & SENIORS
  kids: '528hz',                 // 528 Hz - Amour & Guérison
  seniors: 'theta783',           // Ondes Theta 7.83 Hz

  // VOYAGE INTÉRIEUR
  scan: 'theta6',                // Ondes Theta 6 Hz (SCAN CORPOREL)

  // MÉDITATIONS THÉMATIQUES
  gratitude: '528hz',            // 528 Hz (amour/reconnaissance)
  abundance: '639hz',            // 639 Hz (ouverture/connexion)
  love: '528hz',                 // 528 Hz (évident)
  attraction: '432hz',           // 432 Hz (alignement universel)
  confidence: 'beta',            // Ondes Beta 14 Hz (affirmation/action)
  sleep: 'delta',                // Ondes Delta 2 Hz (sommeil réparateur)
};

export const useAudioManager = () => {
  const { audioSettings, currentSession, currentMeditation, isSessionActive } = useAppStore();
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef(null);
  const gainNodeRef = useRef(null);
  const isPlayingRef = useRef(false);
  const sessionStartTimeRef = useRef(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Reprendre le contexte audio s'il est suspendu
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    return audioContextRef.current;
  };

  const getDefaultFrequency = () => {
    if (currentSession === 'meditation' && currentMeditation) {
      return sessionFrequencies[currentMeditation] || 'coherence';
    }
    return sessionFrequencies[currentSession || 'coherence'] || 'coherence';
  };

  const startAudio = (frequency) => {
    if (!audioSettings.enabled || isPlayingRef.current) return;

    console.log('🎵 DÉMARRAGE AUDIO - Session:', currentSession, 'Fréquence:', frequency);
    
    const selectedFrequency = frequency || getDefaultFrequency();
    const freq = frequencies[selectedFrequency];
    if (!freq) {
      console.error('❌ Fréquence non trouvée:', selectedFrequency);
      return;
    }

    const audioContext = initAudioContext();
    sessionStartTimeRef.current = Date.now();

    try {
      // Créer les oscillateurs
      const oscillatorLeft = audioContext.createOscillator();
      const oscillatorRight = audioContext.createOscillator();

      oscillatorLeft.type = 'sine';
      oscillatorRight.type = 'sine';
      oscillatorLeft.frequency.value = freq.base;
      oscillatorRight.frequency.value = freq.base + freq.beat;

      // Créer les nœuds de gain et de panoramique
      const gainNode = audioContext.createGain();
      const pannerLeft = audioContext.createStereoPanner();
      const pannerRight = audioContext.createStereoPanner();

      pannerLeft.pan.value = -1;
      pannerRight.pan.value = 1;
      
      const recommendedVolume = audioSettings.volume * 0.25;
      gainNode.gain.value = recommendedVolume;

      // Connecter les nœuds
      oscillatorLeft.connect(pannerLeft);
      oscillatorRight.connect(pannerRight);
      pannerLeft.connect(gainNode);
      pannerRight.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Fade in progressif
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(recommendedVolume, audioContext.currentTime + 2);

      // Démarrer les oscillateurs SANS LIMITE DE TEMPS
      oscillatorLeft.start();
      oscillatorRight.start();

      // Stocker les références
      oscillatorsRef.current = { left: oscillatorLeft, right: oscillatorRight };
      gainNodeRef.current = gainNode;
      isPlayingRef.current = true;

      console.log(`🎵 Audio démarré avec succès: ${freq.name} (${selectedFrequency})`);
      console.log('🔊 Volume:', recommendedVolume, 'Base freq:', freq.base, 'Beat:', freq.beat);
      
      // Gestion des erreurs d'oscillateur
      oscillatorLeft.onended = () => {
        console.log('🔄 Oscillateur gauche terminé');
      };
      
      oscillatorRight.onended = () => {
        console.log('🔄 Oscillateur droit terminé');
      };

    } catch (error) {
      console.error('❌ Erreur lors du démarrage audio:', error);
      isPlayingRef.current = false;
    }
  };

  const stopAudio = () => {
    if (!isPlayingRef.current || !oscillatorsRef.current || !gainNodeRef.current) {
      console.log('🔇 Aucun audio à arrêter');
      return;
    }

    const audioContext = audioContextRef.current;
    if (!audioContext) {
      console.log('🔇 Pas de contexte audio');
      return;
    }

    const sessionDuration = sessionStartTimeRef.current ? 
      (Date.now() - sessionStartTimeRef.current) / 1000 : 0;
    
    console.log('🔇 ARRÊT AUDIO - Durée de session:', Math.round(sessionDuration), 'secondes');

    try {
      // Fade out progressif
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

      setTimeout(() => {
        if (oscillatorsRef.current) {
          try {
            oscillatorsRef.current.left.stop();
            oscillatorsRef.current.right.stop();
          } catch (error) {
            console.log('⚠️ Oscillateurs déjà arrêtés');
          }
          oscillatorsRef.current = null;
        }
        gainNodeRef.current = null;
        isPlayingRef.current = false;
        sessionStartTimeRef.current = null;
        console.log('✅ Audio complètement arrêté');
      }, 1000);
    } catch (error) {
      console.error('❌ Erreur lors de l\'arrêt audio:', error);
      // Force cleanup en cas d'erreur
      oscillatorsRef.current = null;
      gainNodeRef.current = null;
      isPlayingRef.current = false;
      sessionStartTimeRef.current = null;
    }
  };

  const playGong = (type = 'inhale') => {
    if (!audioSettings.gongEnabled) {
      console.log('🔕 Gong désactivé');
      return;
    }

    console.log('🔔 GONG:', type);

    const audioContext = initAudioContext();
    const now = audioContext.currentTime;

    try {
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const osc3 = audioContext.createOscillator();

      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      const baseFreq = type === 'inhale' ? 261.63 : 220.00;
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc2.frequency.setValueAtTime(baseFreq * 0.5, now);
      osc3.frequency.setValueAtTime(baseFreq * 1.5, now);

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc3.type = 'sine';

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 2.5);

      const recommendedGongVolume = audioSettings.gongVolume * 0.15;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(recommendedGongVolume, now + 0.03);
      gainNode.gain.linearRampToValueAtTime(recommendedGongVolume * 0.75, now + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc1.stop(now + 3);
      osc2.stop(now + 3);
      osc3.stop(now + 3);

      console.log('🔔 Gong joué avec succès');
    } catch (error) {
      console.error('❌ Erreur gong:', error);
    }
  };

  // Surveiller l'état de la session pour maintenir l'audio
  useEffect(() => {
    if (isSessionActive && !isPlayingRef.current && audioSettings.enabled) {
      console.log('🔄 Session active détectée, redémarrage audio si nécessaire');
      // Redémarrer l'audio si la session est active mais l'audio arrêté
      const frequency = getDefaultFrequency();
      startAudio(frequency);
    } else if (!isSessionActive && isPlayingRef.current) {
      console.log('🔄 Session inactive détectée, arrêt audio');
      stopAudio();
    }
  }, [isSessionActive, audioSettings.enabled]);

  // Surveiller les changements de volume en temps réel
  useEffect(() => {
    if (isPlayingRef.current && gainNodeRef.current && audioContextRef.current) {
      const newVolume = audioSettings.volume * 0.25;
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioContextRef.current.currentTime);
      console.log('🔊 Volume mis à jour:', newVolume);
    }
  }, [audioSettings.volume]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      console.log('🧹 Nettoyage useAudioManager');
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    startAudio,
    stopAudio,
    playGong,
    isPlaying: isPlayingRef.current,
    getDefaultFrequency,
    getCurrentFrequencyName: () => {
      const freq = getDefaultFrequency();
      return frequencies[freq]?.name || 'Cohérence 0.1Hz';
    },
  };
};