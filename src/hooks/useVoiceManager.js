import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export const useVoiceManager = () => {
  const { 
    voiceSettings, 
    currentSession, 
    currentMeditation,
    isSessionActive
  } = useAppStore();
  
  const synth = useRef(window.speechSynthesis);
  const voices = useRef([]);
  const currentUtterance = useRef(null);
  const isInitialized = useRef(false);
  const sessionGuidanceStarted = useRef(false);
  const audioElementRef = useRef(null);
  const timeoutsRef = useRef([]);
  
  // Fonction pour créer un timeout qui sera automatiquement suivi
  const createTrackedTimeout = useCallback((callback, delay, description = '') => {
    console.log(`⏰ CRÉATION TIMEOUT: ${description} dans ${delay}ms`);
    
    const timeoutId = setTimeout(() => {
      console.log(`🔔 EXÉCUTION TIMEOUT: ${description}`);
      
      // Vérifier l'état avant d'exécuter
      if (!isSessionActive) {
        console.log('⚠️ Session inactive, timeout annulé:', description);
        return;
      }
      
      if (!voiceSettings.enabled) {
        console.log('⚠️ Voix désactivée, timeout annulé:', description);
        return;
      }
      
      // Supprimer ce timeout de la liste des timeouts actifs
      timeoutsRef.current = timeoutsRef.current.filter(id => id !== timeoutId);
      callback();
    }, delay);
    
    // Ajouter ce timeout à la liste des timeouts actifs
    timeoutsRef.current.push(timeoutId);
    console.log(`✅ TIMEOUT CRÉÉ: ${description} (ID: ${timeoutId})`);
    
    return timeoutId;
  }, [isSessionActive, voiceSettings.enabled]);
  
  // Fonction pour nettoyer tous les timeouts
  const clearAllTimeouts = useCallback(() => {
    console.log(`🧹 NETTOYAGE: ${timeoutsRef.current.length} timeouts actifs`);
    
    timeoutsRef.current.forEach(id => {
      clearTimeout(id);
    });
    
    timeoutsRef.current = [];
    console.log('✅ Tous les timeouts ont été nettoyés');
  }, []);
  
  // Initialiser les voix
  useEffect(() => {
    const initVoices = () => {
      if (synth.current) {
        voices.current = synth.current.getVoices().filter(voice => 
          voice.lang.includes('fr') || voice.name.includes('French')
        );
        
        if (voices.current.length > 0) {
          isInitialized.current = true;
          console.log('🎤 Voix françaises disponibles:', voices.current.length);
        } else {
          console.log('⚠️ Aucune voix française trouvée, utilisation de la voix par défaut');
          voices.current = synth.current.getVoices();
          isInitialized.current = true;
        }
      }
    };
    
    if (synth.current) {
      if (synth.current.getVoices().length > 0) {
        initVoices();
      }
      synth.current.onvoiceschanged = initVoices;
    }
    
    return () => {
      if (synth.current) {
        synth.current.onvoiceschanged = null;
      }
    };
  }, []);
  
  // Nettoyer à la destruction du composant
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (synth.current) {
        synth.current.cancel();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
    };
  }, [clearAllTimeouts]);
  
  // Réinitialiser le guidage vocal lorsque la session change
  useEffect(() => {
    console.log('🔄 RESET GUIDAGE VOCAL - Nouvelle session');
    sessionGuidanceStarted.current = false;
    clearAllTimeouts();
  }, [currentSession, currentMeditation, clearAllTimeouts]);
  
  // Arrêter le guidage vocal lorsque la session est arrêtée
  useEffect(() => {
    if (!isSessionActive) {
      console.log('🔇 SESSION INACTIVE - ARRÊT COMPLET du guidage vocal');
      clearAllTimeouts();
      
      if (synth.current) {
        synth.current.cancel();
      }
      
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
        audioElementRef.current = null;
      }
      
      sessionGuidanceStarted.current = false;
      window.speechSynthesis.cancel();
    }
  }, [isSessionActive, clearAllTimeouts]);
  
  // Fonction pour parler avec la synthèse vocale
  const speakWithSynthesis = useCallback((text) => {
    if (!voiceSettings.enabled || !text) {
      console.log('🔇 SYNTHÈSE ANNULÉE - Voix désactivée ou texte vide');
      return;
    }
    
    console.log('🗣️ SYNTHÈSE VOCALE:', text.substring(0, 50) + '...');
    
    try {
      if (synth.current) {
        synth.current.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance.current = utterance;
      
      if (voices.current.length > 0) {
        utterance.voice = voices.current[0];
      }
      
      utterance.volume = voiceSettings.volume;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.lang = 'fr-FR';
      
      utterance.onstart = () => {
        console.log('🎤 SYNTHÈSE DÉMARRÉE');
      };
      
      utterance.onend = () => {
        console.log('✅ SYNTHÈSE TERMINÉE');
        currentUtterance.current = null;
      };
      
      utterance.onerror = (event) => {
        console.error('❌ ERREUR SYNTHÈSE:', event);
        currentUtterance.current = null;
      };
      
      synth.current.speak(utterance);
    } catch (error) {
      console.error('❌ ERREUR SYNTHÈSE VOCALE:', error);
    }
  }, [voiceSettings.enabled, voiceSettings.volume]);
  
  // Fonction pour jouer un fichier audio premium avec fallback
  const playPremiumAudio = useCallback((audioPath, fallbackText, description) => {
    console.log(`🎵 TENTATIVE LECTURE AUDIO: ${audioPath}`);
    
    try {
      const audio = new Audio(audioPath);
      audioElementRef.current = audio;
      
      audio.onloadstart = () => {
        console.log(`🔄 CHARGEMENT AUDIO: ${audioPath}`);
      };
      
      audio.oncanplaythrough = () => {
        console.log(`✅ AUDIO PRÊT: ${audioPath}`);
      };
      
      audio.onended = () => {
        console.log(`✅ AUDIO TERMINÉ: ${audioPath}`);
        audioElementRef.current = null;
      };
      
      audio.onerror = (error) => {
        console.log(`❌ ERREUR AUDIO: ${audioPath}`, error);
        console.log(`🔄 FALLBACK SYNTHÈSE pour: ${description}`);
        speakWithSynthesis(fallbackText);
        audioElementRef.current = null;
      };
      
      audio.volume = voiceSettings.volume;
      
      // Essayer de jouer l'audio
      audio.play()
        .then(() => {
          console.log(`🔊 LECTURE DÉMARRÉE: ${audioPath}`);
        })
        .catch(error => {
          console.log(`❌ ERREUR LECTURE: ${audioPath}`, error);
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${description}`);
          speakWithSynthesis(fallbackText);
          audioElementRef.current = null;
        });
        
    } catch (error) {
      console.error(`❌ ERREUR CRÉATION AUDIO: ${audioPath}`, error);
      console.log(`🔄 FALLBACK SYNTHÈSE pour: ${description}`);
      speakWithSynthesis(fallbackText);
    }
  }, [voiceSettings.volume, speakWithSynthesis]);
  
  // Fonction principale pour parler
  const speak = useCallback((text, audioKey = null) => {
    console.log('🎤 SPEAK APPELÉ:', { text: text?.substring(0, 30), audioKey, enabled: voiceSettings.enabled });
    
    if (!voiceSettings.enabled || !text) {
      console.log('🔇 SPEAK ANNULÉ - Voix désactivée ou texte vide');
      return;
    }
    
    const gender = voiceSettings.gender;
    let audioPath = null;
    
    // SYSTÈME PREMIUM POUR SCAN CORPOREL
    if (currentSession === 'scan' && audioKey) {
      audioPath = `/audio/scan-corporel/${gender}/${audioKey}.mp3`;
      console.log(`🧠 SCAN CORPOREL - Tentative audio premium: ${audioPath}`);
      playPremiumAudio(audioPath, text, audioKey);
      return;
    }
    
    // SYSTÈME PREMIUM POUR SOS STRESS (SWITCH)
    if (currentSession === 'switch') {
      if (text.includes('Bienvenue dans votre bulle')) {
        audioPath = `/audio/sos-stress/${gender}/welcome.mp3`;
        playPremiumAudio(audioPath, text, 'welcome');
        return;
      } else if (text.includes('Inspirez le calme')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-calm.mp3`;
        playPremiumAudio(audioPath, text, 'breathe-calm');
        return;
      } else if (text.includes('Vos pieds touchent le sol')) {
        audioPath = `/audio/sos-stress/${gender}/grounding.mp3`;
        playPremiumAudio(audioPath, text, 'grounding');
        return;
      } else if (text.includes('Parfait. Vous avez retrouvé')) {
        audioPath = `/audio/sos-stress/${gender}/completion.mp3`;
        playPremiumAudio(audioPath, text, 'completion');
        return;
      }
    }
    
    // SYSTÈME PREMIUM POUR MÉDITATIONS
    if (currentSession === 'meditation' && currentMeditation) {
      if (currentMeditation === 'metatron') {
        audioPath = `/audio/meditation/${gender}/metatron.mp3`;
        console.log(`🌟 MÉDITATION MÉTATRON - Audio complet: ${audioPath}`);
        playPremiumAudio(audioPath, text, 'metatron');
        return;
      }
    }
    
    // Sinon, utiliser la synthèse vocale
    console.log(`🗣️ SYNTHÈSE DIRECTE: "${text.substring(0, 50)}..."`);
    speakWithSynthesis(text);
  }, [voiceSettings.enabled, voiceSettings.gender, currentSession, currentMeditation, playPremiumAudio, speakWithSynthesis]);
  
  // Fonction pour arrêter toute parole
  const stop = useCallback(() => {
    console.log('🔇 ARRÊT COMPLET du système vocal');
    
    clearAllTimeouts();
    
    if (synth.current) {
      synth.current.cancel();
    }
    
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
      audioElementRef.current = null;
    }
    
    sessionGuidanceStarted.current = false;
    window.speechSynthesis.cancel();
    
    return true;
  }, [clearAllTimeouts]);
  
  // Fonction pour démarrer le guidage vocal Scan Corporel
  const startScanGuidance = useCallback(() => {
    console.log('🧠 DÉMARRAGE SCAN CORPOREL - SYSTÈME SIMPLIFIÉ');
    
    if (!voiceSettings.enabled) {
      console.log('🔇 SCAN: Voix désactivée');
      return false;
    }
    
    if (!isSessionActive) {
      console.log('🔇 SCAN: Session inactive');
      return false;
    }
    
    console.log('🧠 SCAN CORPOREL - DÉMARRAGE IMMÉDIAT');
    clearAllTimeouts();
    
    // Séquence 1 - Accueil (0s) - IMMÉDIAT
    speak("Bienvenue dans cette séance de scan corporel. Installez-vous confortablement, fermez les yeux si vous le souhaitez.", "welcome");
    
    // Séquence 2 - Tête (30s)
    createTrackedTimeout(() => {
      speak("Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement.", "head");
    }, 30000, "Scan Tête");
    
    // Séquence 3 - Visage (60s)
    createTrackedTimeout(() => {
      speak("Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières.", "face");
    }, 60000, "Scan Visage");
    
    // Séquence 4 - Cou (90s)
    createTrackedTimeout(() => {
      speak("Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension.", "neck");
    }, 90000, "Scan Cou");
    
    // Séquence 5 - Poitrine (120s)
    createTrackedTimeout(() => {
      speak("Votre poitrine s'ouvre et se détend à chaque respiration. Sentez l'air qui entre et qui sort librement.", "chest");
    }, 120000, "Scan Poitrine");
    
    console.log('✅ SCAN CORPOREL: Timeouts programmés');
    return true;
  }, [voiceSettings.enabled, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction pour démarrer le guidage vocal SOS Stress
  const startSosStressGuidance = useCallback(() => {
    console.log('🚨 DÉMARRAGE SOS STRESS - SYSTÈME SIMPLIFIÉ');
    
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 SOS: Voix désactivée ou session inactive');
      return false;
    }
    
    console.log('🚨 SOS STRESS - DÉMARRAGE IMMÉDIAT');
    clearAllTimeouts();
    
    // Séquence 1 - Accueil (0.5s)
    createTrackedTimeout(() => {
      speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.");
    }, 500, "SOS Accueil");
    
    // Séquence 2 - Inspiration (12s)
    createTrackedTimeout(() => {
      speak("Inspirez le calme");
    }, 12000, "SOS Inspiration");
    
    // Séquence 3 - Ancrage (28s)
    createTrackedTimeout(() => {
      speak("Vos pieds touchent le sol. Vous êtes ancré, solide, stable.");
    }, 28000, "SOS Ancrage");
    
    // Séquence 4 - Fin (85s)
    createTrackedTimeout(() => {
      speak("Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.");
    }, 85000, "SOS Fin");
    
    console.log('✅ SOS STRESS: Timeouts programmés');
    return true;
  }, [voiceSettings.enabled, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction principale pour démarrer le guidage vocal
  const startSessionGuidance = useCallback(() => {
    console.log('🎤 START SESSION GUIDANCE - Session:', currentSession, 'Méditation:', currentMeditation);
    console.log('🔍 État:', {
      voiceEnabled: voiceSettings.enabled,
      sessionActive: isSessionActive,
      guidanceStarted: sessionGuidanceStarted.current
    });
    
    if (!voiceSettings.enabled) {
      console.log('🔇 GUIDAGE ANNULÉ - Voix désactivée');
      return false;
    }
    
    if (!isSessionActive) {
      console.log('🔇 GUIDAGE ANNULÉ - Session inactive');
      return false;
    }
    
    if (sessionGuidanceStarted.current) {
      console.log('⚠️ GUIDAGE DÉJÀ DÉMARRÉ');
      return false;
    }
    
    sessionGuidanceStarted.current = true;
    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL CONFIRMÉ');
    
    // Router vers la bonne fonction selon la session
    if (currentSession === 'switch') {
      console.log('🚨 ROUTER: Démarrage SOS Stress');
      return startSosStressGuidance();
    } else if (currentSession === 'scan') {
      console.log('🧠 ROUTER: Démarrage Scan Corporel');
      return startScanGuidance();
    } else {
      // Guidage générique pour les autres sessions
      console.log('🎤 ROUTER: Guidage générique pour session:', currentSession);
      speak("Bienvenue dans votre session. Suivez le rythme respiratoire et laissez-vous guider.");
      return true;
    }
  }, [currentSession, currentMeditation, startSosStressGuidance, startScanGuidance, speak, voiceSettings.enabled, isSessionActive]);
  
  return {
    speak,
    stop,
    clearAllTimeouts,
    startSessionGuidance: useCallback(() => {
      console.log('🔄 RESET ET DÉMARRAGE GUIDAGE');
      sessionGuidanceStarted.current = false;
      clearAllTimeouts();
      return startSessionGuidance();
    }, [startSessionGuidance, clearAllTimeouts]),
    isInitialized: isInitialized.current,
  };
};