import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

export const useVoiceManager = () => {
  const { voiceSettings, currentSession, isSessionActive } = useAppStore();
  const scheduledTimeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Système vocal pour voix enregistrées
  const getSosAudioPath = (filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/sos-stress/${gender}/${filename}.mp3`;
  };

  const getScanAudioPath = (filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/scan-corporel/${gender}/${filename}.mp3`;
  };

  // Mapping des fichiers SOS Stress
  const SOS_AUDIO_FILES = {
    welcome: 'welcome',
    breatheCalm: 'breathe-calm',
    grounding: 'grounding',
    breatheSoftly: 'breathe-softly',
    breatheFresh: 'breathe-fresh',
    stressRelease: 'stress-release',
    breatheRelease: 'breathe-release',
    centerPeace: 'center-peace',
    completion: 'completion'
  };

  // Mapping des fichiers Scan Corporel
  const SCAN_AUDIO_FILES = {
    welcome: 'welcome',
    head: 'head',
    face: 'face',
    neck: 'neck',
    chest: 'chest',
    back: 'back',
    abdomen: 'abdomen',
    hips: 'hips',
    thighs: 'thighs',
    knees: 'knees',
    calves: 'calves',
    ankles: 'ankles',
    feet: 'feet',
    wholebody: 'wholebody',
    breathing: 'breathing',
    awareness: 'awareness',
    presence: 'presence',
    completion: 'completion'
  };

  // Textes de fallback pour SOS Stress
  const SOS_FALLBACK_TEXTS = {
    welcome: "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.",
    breatheCalm: "Inspirez le calme",
    grounding: "Vos pieds touchent le sol. Vous êtes ancré, solide, stable.",
    breatheSoftly: "Soufflez doucement",
    breatheFresh: "Accueillez l'air frais",
    stressRelease: "Le stress s'évapore à chaque souffle. Votre corps se détend profondément.",
    breatheRelease: "Relâchez tout",
    centerPeace: "Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.",
    completion: "Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous."
  };

  // Textes de fallback pour Scan Corporel
  const SCAN_FALLBACK_TEXTS = {
    welcome: "Bienvenue dans cette séance de scan corporel. Installez-vous confortablement, fermez les yeux si vous le souhaitez. Nous allons explorer chaque partie de votre corps pour une relaxation profonde.",
    head: "Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement. Laissez toute tension se dissoudre.",
    face: "Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières. Détendez vos mâchoires, votre langue, votre gorge. Laissez votre visage s'adoucir.",
    neck: "Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension accumulée dans cette zone. Sentez un agréable relâchement.",
    chest: "Votre poitrine s'ouvre et se détend à chaque respiration. Sentez l'air qui entre et qui sort librement. Accueillez cette sensation d'espace.",
    back: "Votre dos se détend vertèbre par vertèbre, du haut vers le bas. Chaque vertèbre s'aligne parfaitement. Sentez le support sous votre dos.",
    abdomen: "Votre ventre se gonfle et se dégonfle naturellement, sans effort. Sentez une douce chaleur s'y répandre. Laissez votre respiration se faire librement.",
    hips: "Vos hanches et votre bassin se relâchent complètement. Sentez le poids de votre corps s'enfoncer dans le support. Laissez aller toute tension.",
    thighs: "Vos cuisses se détendent profondément. Sentez les muscles se relâcher, devenir lourds et confortables. Toute tension s'évapore.",
    knees: "Vos genoux se détendent. Sentez l'espace dans vos articulations. Laissez-les se relâcher complètement.",
    calves: "Vos mollets se relâchent entièrement. Sentez l'énergie circuler librement. Chaque fibre musculaire se détend.",
    ankles: "Vos chevilles se détendent. Sentez l'espace dans ces articulations. Laissez toute tension se dissoudre.",
    feet: "Vos pieds, jusqu'au bout de vos orteils, sont maintenant complètement détendus et lourds. Sentez la chaleur et le relâchement dans cette zone.",
    wholebody: "Une vague de bien-être parcourt maintenant tout votre corps, de la tête aux pieds. Vous êtes dans un état de relaxation profonde. Savourez cette sensation d'unité.",
    breathing: "Observez votre respiration, calme et régulière. Chaque inspiration vous apporte énergie et vitalité. Chaque expiration approfondit votre relaxation.",
    awareness: "Prenez conscience de votre corps dans son ensemble, parfaitement détendu et en harmonie. Ressentez cette présence paisible qui vous habite.",
    presence: "Restez dans cet état de relaxation profonde, en pleine conscience de votre corps et de votre respiration. Savourez ce moment de paix intérieure.",
    completion: "Progressivement, reprenez conscience de votre environnement. Bougez doucement vos doigts, vos orteils. Étirez-vous si vous le souhaitez. Votre corps est maintenant complètement détendu et votre esprit apaisé."
  };

  // Fonction pour jouer un fichier audio local avec retry
  const playLocalAudio = async (audioPath) => {
    if (isPlayingRef.current) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!isPlayingRef.current) {
            clearInterval(checkInterval);
            playLocalAudio(audioPath).then(resolve);
          }
        }, 100);
      });
    }
    
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioPath);
      audio.volume = voiceSettings.volume;
      audio.preload = 'auto';
      currentAudioRef.current = audio;
      isPlayingRef.current = true;

      const timeout = setTimeout(() => {
        isPlayingRef.current = false;
        reject(new Error(`Fichier premium non trouvé: ${audioPath}`));
      }, 5000);

      audio.oncanplaythrough = () => {
        clearTimeout(timeout);
      };

      audio.onended = () => {
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        resolve();
      };

      audio.onerror = (e) => {
        clearTimeout(timeout);
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        reject(new Error(`Erreur lecture fichier premium: ${audioPath}`));
      };

      audio.play().then(() => {
        clearTimeout(timeout);
      }).catch((playError) => {
        clearTimeout(timeout);
        isPlayingRef.current = false;
        reject(playError);
      });
    });
  };

  // Fonction pour synthèse vocale (fallback)
  const speakWithSystemVoice = (text) => {
    if (isPlayingRef.current) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!isPlayingRef.current) {
            clearInterval(checkInterval);
            speakWithSystemVoice(text).then(resolve);
          }
        }, 100);
      });
    }

    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech Synthesis non supporté'));
        return;
      }

      speechSynthesis.cancel();
      isPlayingRef.current = true;
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 0.75;
        utterance.pitch = voiceSettings.gender === 'male' ? 0.85 : 1.1;
        utterance.volume = voiceSettings.volume;
        utterance.lang = 'fr-FR';

        const voices = speechSynthesis.getVoices();
        const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
        
        if (frenchVoices.length > 0) {
          const preferredVoices = voiceSettings.gender === 'female' 
            ? ['Claire', 'Amélie', 'Marie', 'Audrey', 'Google français', 'Samantha']
            : ['Thierry', 'Thomas', 'Nicolas', 'Google français', 'Alex'];
          
          let selectedVoice = null;
          for (const preferred of preferredVoices) {
            selectedVoice = frenchVoices.find(v => v.name.includes(preferred));
            if (selectedVoice) break;
          }
          
          utterance.voice = selectedVoice || frenchVoices[0];
        }

        utterance.onend = () => {
          isPlayingRef.current = false;
          resolve();
        };

        utterance.onerror = (event) => {
          isPlayingRef.current = false;
          resolve();
        };

        speechSynthesis.speak(utterance);
      }, 300);
    });
  };

  // Fonction pour jouer un audio SOS avec fallback
  const playSosAudio = async (audioKey) => {
    try {
      const audioPath = getSosAudioPath(SOS_AUDIO_FILES[audioKey]);
      await playLocalAudio(audioPath);
    } catch (error) {
      const fallbackText = SOS_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
        } catch (fallbackError) {
          // Silencieux en cas d'erreur
        }
      }
    }
  };

  // Fonction pour jouer un audio Scan Corporel avec fallback
  const playScanAudio = async (audioKey) => {
    try {
      const audioPath = getScanAudioPath(SCAN_AUDIO_FILES[audioKey]);
      await playLocalAudio(audioPath);
    } catch (error) {
      const fallbackText = SCAN_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
        } catch (fallbackError) {
          // Silencieux en cas d'erreur
        }
      }
    }
  };

  // Fonction principale pour parler (autres sessions)
  const speak = (text) => {
    if (!voiceSettings.enabled || !text.trim()) {
      return Promise.resolve();
    }

    return speakWithSystemVoice(text);
  };

  // Système vocal SOS Stress
  const startSosGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const sosTimings = [
      { time: 500, audioKey: 'welcome' },
      { time: 12000, audioKey: 'breatheCalm' },
      { time: 28000, audioKey: 'grounding' },
      { time: 37000, audioKey: 'breatheSoftly' },
      { time: 48000, audioKey: 'breatheFresh' },
      { time: 58000, audioKey: 'stressRelease' },
      { time: 67000, audioKey: 'breatheRelease' },
      { time: 78000, audioKey: 'centerPeace' },
      { time: 82000, audioKey: 'completion' }
    ];

    sosTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSosAudio(audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Scan Corporel
  const startScanGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const scanTimings = [
      { time: 0, audioKey: 'welcome' },
      { time: 30, audioKey: 'head' },
      { time: 60, audioKey: 'face' },
      { time: 90, audioKey: 'neck' },
      { time: 120, audioKey: 'chest' },
      { time: 150, audioKey: 'back' },
      { time: 180, audioKey: 'abdomen' },
      { time: 210, audioKey: 'hips' },
      { time: 240, audioKey: 'thighs' },
      { time: 255, audioKey: 'knees' },
      { time: 270, audioKey: 'calves' },
      { time: 285, audioKey: 'ankles' },
      { time: 300, audioKey: 'feet' },
      { time: 360, audioKey: 'wholebody' },
      { time: 420, audioKey: 'breathing' },
      { time: 480, audioKey: 'awareness' },
      { time: 540, audioKey: 'presence' },
      { time: 570, audioKey: 'completion' }
    ];

    scanTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playScanAudio(audioKey);
        }
      }, time * 1000);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Cohérence Cardiaque
  const startCoherenceGuidance = (coherenceSettings) => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    if (!voiceSettings.enabled || coherenceSettings.silentMode) {
      return;
    }

    const coherenceMessages = {
      welcome: `Session de cohérence cardiaque démarrée. Durée : ${coherenceSettings.duration} minutes. Rythme respiratoire : ${coherenceSettings.rhythm}. Respirez calmement et suivez le guide visuel.`,
      midSession: "Vous êtes dans un excellent rythme. Continuez à respirer calmement. Laissez votre cœur et votre respiration s'harmoniser.",
      finalMinute: "Dernière minute de votre session. Maintenez ce rythme apaisant. Ressentez l'harmonie entre votre cœur et votre respiration.",
      completion: "Session de cohérence cardiaque terminée. Vous avez créé un état d'harmonie intérieure. Gardez cette sensation de calme avec vous."
    };

    const durationMs = coherenceSettings.duration * 60 * 1000;
    const midSessionTime = Math.floor(durationMs * 0.4);
    const finalMinuteTime = durationMs - 60000;

    const coherenceTimings = [
      { time: 2000, message: coherenceMessages.welcome },
      { time: midSessionTime, message: coherenceMessages.midSession },
      { time: finalMinuteTime, message: coherenceMessages.finalMinute }
    ];

    if (coherenceSettings.duration >= 2) {
      coherenceTimings.push({ 
        time: durationMs - 5000, 
        message: coherenceMessages.completion
      });
    }

    coherenceTimings.forEach(({ time, message }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          speakWithSystemVoice(message);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal unifié
  const startSessionGuidance = (coherenceSettings = null) => {
    if (!voiceSettings.enabled) {
      return;
    }

    if (currentSession === 'switch') {
      startSosGuidance();
    } else if (currentSession === 'scan') {
      startScanGuidance();
    } else if (currentSession === 'coherence' && coherenceSettings) {
      startCoherenceGuidance(coherenceSettings);
    } else {
      speak("Session démarrée. Suivez le guide respiratoire.", true);
    }
  };

  // Arrêter tout
  const stop = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    isPlayingRef.current = false;
    
    try {
      speechSynthesis.cancel();
    } catch (error) {
      // Silencieux
    }
  };

  // Initialisation
  useEffect(() => {
    const initVoices = () => {
      const voices = speechSynthesis.getVoices();
      
      const claire = voices.find(v => v.name.includes('Claire'));
      const thierry = voices.find(v => v.name.includes('Thierry'));
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', initVoices);
    } else {
      initVoices();
    }

    return () => {
      stop();
      speechSynthesis.removeEventListener('voiceschanged', initVoices);
    };
  }, [currentSession]);

  return {
    speak,
    stop,
    isProcessing: isPlayingRef.current,
    startSessionGuidance,
    startCoherenceGuidance,
    playLocalAudio,
    playSosAudio,
    playScanAudio,
    getSosAudioPath,
    getScanAudioPath,
    SOS_AUDIO_FILES,
    SCAN_AUDIO_FILES,
    SOS_FALLBACK_TEXTS,
    SCAN_FALLBACK_TEXTS,
  };
};