import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

export const useVoiceManager = () => {
  const { voiceSettings, currentSession, isSessionActive, currentMeditation } = useAppStore();
  const scheduledTimeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Fonction générique pour obtenir le chemin audio d'une session
  const getSessionAudioPath = (sessionId, filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/${sessionId}/${gender}/${filename}.mp3`;
  };

  // Mapping des fichiers audio pour chaque session
  const SESSION_AUDIO_MAPPINGS = {
    // SOS Stress (SWITCH) - déjà configuré
    switch: {
      welcome: 'welcome',
      breatheCalm: 'breathe-calm',
      grounding: 'grounding',
      breatheSoftly: 'breathe-softly',
      breatheFresh: 'breathe-fresh',
      stressRelease: 'stress-release',
      breatheRelease: 'breathe-release',
      centerPeace: 'center-peace',
      completion: 'completion'
    },
    
    // RESET (4/7/8)
    reset: {
      welcome: 'welcome',
      phase1: 'phase1',
      phase2: 'phase2',
      phase3: 'phase3',
      completion: 'completion'
    },
    
    // PROGRESSIVE (3/3 → 4/4 → 5/5)
    progressive: {
      welcome: 'welcome',
      phase1: 'phase1', // 3/3
      transition1: 'transition1',
      phase2: 'phase2', // 4/4
      transition2: 'transition2',
      phase3: 'phase3', // 5/5
      completion: 'completion'
    },
    
    // KIDS
    kids: {
      welcome: 'welcome',
      breathe1: 'breathe1',
      breathe2: 'breathe2',
      breathe3: 'breathe3',
      completion: 'completion'
    },
    
    // SENIORS
    seniors: {
      welcome: 'welcome',
      relax1: 'relax1',
      relax2: 'relax2',
      relax3: 'relax3',
      completion: 'completion'
    },
    
    // SCAN CORPOREL - déjà configuré
    scan: {
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
    },
    
    // MÉDITATIONS
    meditation: {
      welcome: 'welcome',
      guidance1: 'guidance1',
      guidance2: 'guidance2',
      guidance3: 'guidance3',
      completion: 'completion'
    },
    
    // COHÉRENCE CARDIAQUE
    coherence: {
      welcome: 'welcome',
      midSession: 'mid-session',
      finalMinute: 'final-minute',
      completion: 'completion'
    },
    
    // SESSION LIBRE
    free: {
      welcome: 'welcome',
      guidance: 'guidance',
      completion: 'completion'
    }
  };

  // Textes de fallback pour toutes les sessions
  const SESSION_FALLBACK_TEXTS = {
    // SOS Stress (SWITCH) - déjà configuré
    switch: {
      welcome: "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.",
      breatheCalm: "Inspirez le calme",
      grounding: "Vos pieds touchent le sol. Vous êtes ancré, solide, stable.",
      breatheSoftly: "Soufflez doucement",
      breatheFresh: "Accueillez l'air frais",
      stressRelease: "Le stress s'évapore à chaque souffle. Votre corps se détend profondément.",
      breatheRelease: "Relâchez tout",
      centerPeace: "Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.",
      completion: "Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous."
    },
    
    // RESET
    reset: {
      welcome: "Bienvenue dans votre session RESET. Cette technique 4-7-8 va calmer votre système nerveux.",
      phase1: "Inspirez par le nez pendant 4 secondes. Remplissez vos poumons calmement.",
      phase2: "Retenez votre souffle pendant 7 secondes. Gardez l'air précieux en vous.",
      phase3: "Expirez lentement pendant 8 secondes. Relâchez tout par la bouche.",
      completion: "Magnifique. Votre système nerveux est maintenant apaisé."
    },
    
    // PROGRESSIVE
    progressive: {
      welcome: "Bienvenue dans votre entraînement progressif. Nous allons évoluer du rythme 3/3 vers le 5/5.",
      phase1: "Phase 1 : Rythme 3/3. Respirez doucement et naturellement.",
      transition1: "Passage au rythme 4/4. Respirez un peu plus profondément.",
      phase2: "Phase 2 : Rythme 4/4. Votre respiration s'approfondit naturellement.",
      transition2: "Passage au rythme 5/5. Respirez profondément et calmement.",
      phase3: "Phase 3 : Rythme 5/5. Vous maîtrisez maintenant la cohérence cardiaque.",
      completion: "Excellent ! Vous avez progressé du rythme débutant 3/3 jusqu'au rythme 5/5."
    },
    
    // KIDS
    kids: {
      welcome: "Salut petit champion ! On va faire de la respiration magique ensemble.",
      breathe1: "Inspire comme un ballon qui se gonfle. Respire l'air magique.",
      breathe2: "Imagine que tu es un arbre avec des racines. Tu es fort et stable !",
      breathe3: "Tu es un petit chat qui s'étire et qui se détend.",
      completion: "Super ! Tu as fait de la vraie magie avec ta respiration."
    },
    
    // SENIORS
    seniors: {
      welcome: "Bienvenue dans votre session de relaxation adaptée. Cette respiration douce va vous aider.",
      relax1: "Cette respiration 3/4 est parfaitement adaptée à votre rythme.",
      relax2: "Votre tension artérielle commence à diminuer. Votre cœur bat plus calmement.",
      relax3: "Vos muscles se relâchent progressivement. Vous vous sentez de plus en plus détendu.",
      completion: "Excellent ! Vous avez pris soin de votre bien-être."
    },
    
    // SCAN CORPOREL - déjà configuré
    scan: {
      welcome: "Bienvenue dans cette séance de scan corporel. Installez-vous confortablement.",
      head: "Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre.",
      face: "Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières.",
      neck: "Votre cou et vos épaules se relâchent maintenant.",
      chest: "Votre poitrine s'ouvre et se détend à chaque respiration.",
      back: "Votre dos se détend vertèbre par vertèbre, du haut vers le bas.",
      abdomen: "Votre ventre se gonfle et se dégonfle naturellement, sans effort.",
      hips: "Vos hanches et votre bassin se relâchent complètement.",
      thighs: "Vos cuisses se détendent profondément.",
      knees: "Vos genoux se détendent. Sentez l'espace dans vos articulations.",
      calves: "Vos mollets se relâchent entièrement.",
      ankles: "Vos chevilles se détendent.",
      feet: "Vos pieds sont maintenant complètement détendus et lourds.",
      wholebody: "Une vague de bien-être parcourt maintenant tout votre corps.",
      breathing: "Observez votre respiration, calme et régulière.",
      awareness: "Prenez conscience de votre corps dans son ensemble.",
      presence: "Restez dans cet état de relaxation profonde.",
      completion: "Progressivement, reprenez conscience de votre environnement."
    },
    
    // MÉDITATIONS
    meditation: {
      welcome: "Bienvenue dans cette méditation. Installez-vous confortablement.",
      guidance1: "Laissez votre respiration vous guider vers un état de paix intérieure.",
      guidance2: "Accueillez les sensations de détente qui se répandent dans votre corps.",
      guidance3: "Savourez ce moment de connexion avec vous-même.",
      completion: "Votre méditation se termine. Gardez cette sérénité avec vous."
    },
    
    // COHÉRENCE CARDIAQUE
    coherence: {
      welcome: "Session de cohérence cardiaque démarrée. Respirez calmement et suivez le guide visuel.",
      midSession: "Vous êtes dans un excellent rythme. Continuez à respirer calmement.",
      finalMinute: "Dernière minute de votre session. Maintenez ce rythme apaisant.",
      completion: "Session de cohérence cardiaque terminée. Vous avez créé un état d'harmonie intérieure."
    },
    
    // SESSION LIBRE
    free: {
      welcome: "Session libre démarrée. Suivez votre rythme respiratoire personnalisé.",
      guidance: "Vous contrôlez votre respiration. Maintenez ce rythme qui vous convient.",
      completion: "Session libre terminée. Vous avez maintenu votre rythme personnalisé avec succès."
    }
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
        reject(new Error(`Fichier audio non trouvé: ${audioPath}`));
      }, 3000);

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
        reject(new Error(`Erreur lecture fichier: ${audioPath}`));
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

  // Fonction générique pour jouer un audio avec fallback
  const playSessionAudio = async (sessionId, audioKey) => {
    try {
      const mapping = SESSION_AUDIO_MAPPINGS[sessionId];
      if (!mapping || !mapping[audioKey]) {
        throw new Error(`Mapping non trouvé pour ${sessionId}.${audioKey}`);
      }

      const audioPath = getSessionAudioPath(sessionId, mapping[audioKey]);
      await playLocalAudio(audioPath);
    } catch (error) {
      // Fallback vers synthèse vocale
      const fallbackTexts = SESSION_FALLBACK_TEXTS[sessionId];
      if (fallbackTexts && fallbackTexts[audioKey]) {
        try {
          await speakWithSystemVoice(fallbackTexts[audioKey]);
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

  // Système vocal SOS Stress (SWITCH) - conservé tel quel
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
          playSessionAudio('switch', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal RESET
  const startResetGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const resetTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 15000, audioKey: 'phase1' },
      { time: 45000, audioKey: 'phase2' },
      { time: 90000, audioKey: 'phase3' },
      { time: 170000, audioKey: 'completion' }
    ];

    resetTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('reset', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal PROGRESSIVE
  const startProgressiveGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const progressiveTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 5000, audioKey: 'phase1' },
      { time: 58000, audioKey: 'transition1' },
      { time: 62000, audioKey: 'phase2' },
      { time: 118000, audioKey: 'transition2' },
      { time: 122000, audioKey: 'phase3' },
      { time: 175000, audioKey: 'completion' }
    ];

    progressiveTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('progressive', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal KIDS
  const startKidsGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const kidsTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 15000, audioKey: 'breathe1' },
      { time: 45000, audioKey: 'breathe2' },
      { time: 75000, audioKey: 'breathe3' },
      { time: 115000, audioKey: 'completion' }
    ];

    kidsTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('kids', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal SENIORS
  const startSeniorsGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const seniorsTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 30000, audioKey: 'relax1' },
      { time: 120000, audioKey: 'relax2' },
      { time: 210000, audioKey: 'relax3' },
      { time: 290000, audioKey: 'completion' }
    ];

    seniorsTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('seniors', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Scan Corporel - conservé tel quel
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
          playSessionAudio('scan', audioKey);
        }
      }, time * 1000);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Méditations
  const startMeditationGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const meditationTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 60000, audioKey: 'guidance1' },
      { time: 180000, audioKey: 'guidance2' },
      { time: 240000, audioKey: 'guidance3' },
      { time: 290000, audioKey: 'completion' }
    ];

    meditationTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('meditation', audioKey);
        }
      }, time);
      
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

    const durationMs = coherenceSettings.duration * 60 * 1000;
    const midSessionTime = Math.floor(durationMs * 0.4);
    const finalMinuteTime = durationMs - 60000;

    const coherenceTimings = [
      { time: 2000, audioKey: 'welcome' },
      { time: midSessionTime, audioKey: 'midSession' },
      { time: finalMinuteTime, audioKey: 'finalMinute' }
    ];

    if (coherenceSettings.duration >= 2) {
      coherenceTimings.push({ 
        time: durationMs - 5000, 
        audioKey: 'completion'
      });
    }

    coherenceTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('coherence', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal Session Libre
  const startFreeSessionGuidance = () => {
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    const freeTimings = [
      { time: 1000, audioKey: 'welcome' },
      { time: 60000, audioKey: 'guidance' },
      { time: 290000, audioKey: 'completion' }
    ];

    freeTimings.forEach(({ time, audioKey }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          playSessionAudio('free', audioKey);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });
  };

  // Système vocal unifié - ÉTENDU
  const startSessionGuidance = (coherenceSettings = null) => {
    if (!voiceSettings.enabled) {
      return;
    }

    switch (currentSession) {
      case 'switch':
        startSosGuidance();
        break;
      case 'reset':
        startResetGuidance();
        break;
      case 'progressive':
        startProgressiveGuidance();
        break;
      case 'kids':
        startKidsGuidance();
        break;
      case 'seniors':
        startSeniorsGuidance();
        break;
      case 'scan':
        startScanGuidance();
        break;
      case 'meditation':
        startMeditationGuidance();
        break;
      case 'coherence':
        if (coherenceSettings) {
          startCoherenceGuidance(coherenceSettings);
        }
        break;
      case 'free':
        startFreeSessionGuidance();
        break;
      default:
        speak("Session démarrée. Suivez le guide respiratoire.");
        break;
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
    playSessionAudio,
    getSessionAudioPath,
    SESSION_AUDIO_MAPPINGS,
    SESSION_FALLBACK_TEXTS,
  };
};