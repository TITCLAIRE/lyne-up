import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

const frequencies = {
  coherence: { base: 256, beat: 0.1, name: 'Cohérence 0.1Hz' },
  '528hz': { base: 528, beat: 6, name: 'Amour & Guérison 528Hz' },
  '432hz': { base: 432, beat: 8, name: 'Harmonie Naturelle 432Hz' },
  '396hz': { base: 396, beat: 5, name: 'Libération 396Hz' },
  '639hz': { base: 639, beat: 7, name: 'Relations 639Hz' },
  theta: { base: 200, beat: 4, name: 'Ondes Theta (4-8Hz)' },
  alpha: { base: 300, beat: 10, name: 'Ondes Alpha (8-13Hz)' },
  beta: { base: 400, beat: 20, name: 'Ondes Beta (13-30Hz)' },
  delta: { base: 150, beat: 2, name: 'Ondes Delta (0.5-4Hz)' },
  gamma: { base: 500, beat: 40, name: 'Ondes Gamma (30-100Hz)' },
};

const sessionFrequencies = {
  switch: 'theta',    // SWITCH : Theta pour relaxation rapide
  reset: 'delta',     // RESET : Delta pour relaxation profonde et sommeil
  kids: 'alpha',      // KIDS : Alpha pour calme et concentration enfants
  scan: 'delta',      // Scan Corporel : Delta pour relaxation profonde
  coherence: 'coherence', // Cohérence cardiaque : 0,1 Hz
  // Méditations
  gratitude: '528hz',     // Gratitude : 528 Hz
  confidence: 'beta',     // Confiance en Soi : Beta
  love: '639hz',          // Amour Universel : 639 Hz
  abundance: '528hz',     // Abondance : 528 Hz
  attraction: '432hz',    // Loi d'Attraction : 432 Hz
  sleep: 'delta',         // Sommeil Profond : Delta
};

export const useAudioManager = () => {
  const { audioSettings, currentSession, currentMeditation } = useAppStore();
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef(null);
  const gainNodeRef = useRef(null);
  const isPlayingRef = useRef(false);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
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

    const selectedFrequency = frequency || getDefaultFrequency();
    const freq = frequencies[selectedFrequency];
    if (!freq) return;

    const audioContext = initAudioContext();

    try {
      const oscillatorLeft = audioContext.createOscillator();
      const oscillatorRight = audioContext.createOscillator();

      oscillatorLeft.type = 'sine';
      oscillatorRight.type = 'sine';
      oscillatorLeft.frequency.value = freq.base;
      oscillatorRight.frequency.value = freq.base + freq.beat;

      const gainNode = audioContext.createGain();
      const pannerLeft = audioContext.createStereoPanner();
      const pannerRight = audioContext.createStereoPanner();

      pannerLeft.pan.value = -1;
      pannerRight.pan.value = 1;
      
      const recommendedVolume = audioSettings.volume * 0.25;
      gainNode.gain.value = recommendedVolume;

      oscillatorLeft.connect(pannerLeft);
      oscillatorRight.connect(pannerRight);
      pannerLeft.connect(gainNode);
      pannerRight.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(recommendedVolume, audioContext.currentTime + 2);

      oscillatorLeft.start();
      oscillatorRight.start();

      oscillatorsRef.current = { left: oscillatorLeft, right: oscillatorRight };
      gainNodeRef.current = gainNode;
      isPlayingRef.current = true;

      console.log(`🎵 Audio démarré: ${freq.name} (${selectedFrequency})`);
    } catch (error) {
      console.error('Erreur audio:', error);
    }
  };

  const stopAudio = () => {
    if (!isPlayingRef.current || !oscillatorsRef.current || !gainNodeRef.current) return;

    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    try {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

      setTimeout(() => {
        if (oscillatorsRef.current) {
          oscillatorsRef.current.left.stop();
          oscillatorsRef.current.right.stop();
          oscillatorsRef.current = null;
        }
        gainNodeRef.current = null;
        isPlayingRef.current = false;
      }, 1000);
    } catch (error) {
      console.error('Erreur arrêt audio:', error);
    }
  };

  const playGong = (type = 'inhale') => {
    if (!audioSettings.gongEnabled) return;

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
    } catch (error) {
      console.error('Erreur gong:', error);
    }
  };

  useEffect(() => {
    return () => {
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