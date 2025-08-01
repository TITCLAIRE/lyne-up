import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { meditations, spiritualMeditations } from '../data/meditations';

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
  const audioQueue = useRef([]);
  const isPlayingAudio = useRef(false);
  const timeoutsRef = useRef([]);
  const fullAudioRef = useRef(null);
  
  // DIAGNOSTIC COMPLET - Fonction pour logger l'état
  const logVoiceState = useCallback(() => {
    console.log('🔍 DIAGNOSTIC VOCAL COMPLET:');
    console.log('  - voiceSettings.enabled:', voiceSettings.enabled);
    console.log('  - voiceSettings.gender:', voiceSettings.gender);
    console.log('  - voiceSettings.volume:', voiceSettings.volume);
    console.log('  - currentSession:', currentSession);
    console.log('  - currentMeditation:', currentMeditation);
    console.log('  - isSessionActive:', isSessionActive);
    console.log('  - sessionGuidanceStarted:', sessionGuidanceStarted.current);
    console.log('  - timeouts actifs:', timeoutsRef.current.length);
    console.log('  - isInitialized:', isInitialized.current);
  }, [voiceSettings, currentSession, currentMeditation, isSessionActive]);
  
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
      console.log(`🗑️ Timeout supprimé: ${id}`);
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
      if (fullAudioRef.current) {
        fullAudioRef.current.pause();
        fullAudioRef.current = null;
      }
      audioQueue.current = [];
      isPlayingAudio.current = false;
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
      
      if (fullAudioRef.current) {
        fullAudioRef.current.pause();
        fullAudioRef.current.src = '';
        fullAudioRef.current = null;
      }
      
      audioQueue.current = [];
      isPlayingAudio.current = false;
      sessionGuidanceStarted.current = false;
      
      // Forcer l'arrêt de toute synthèse vocale
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
  
  // Fonction pour jouer le prochain audio dans la file d'attente
  const playNextInQueue = useCallback(() => {
    if (audioQueue.current.length === 0) {
      isPlayingAudio.current = false;
      console.log('📭 File d\'attente audio vide');
      return;
    }
    
    const nextAudio = audioQueue.current.shift();
    isPlayingAudio.current = true;
    
    console.log('🎵 LECTURE AUDIO PREMIUM:', nextAudio.key, nextAudio.url);
    
    try {
      const audio = new Audio(nextAudio.url);
      audioElementRef.current = audio;
      
      audio.onended = () => {
        console.log('✅ AUDIO PREMIUM TERMINÉ:', nextAudio.key);
        audioElementRef.current = null;
        playNextInQueue();
      };
      
      audio.onerror = (error) => {
        console.error('❌ ERREUR AUDIO PREMIUM:', nextAudio.url, error);
        
        if (nextAudio.fallbackText) {
          console.log('🔄 FALLBACK SYNTHÈSE pour:', nextAudio.key);
          speakWithSynthesis(nextAudio.fallbackText);
        }
        
        audioElementRef.current = null;
        playNextInQueue();
      };
      
      audio.volume = voiceSettings.volume;
      audio.play()
        .catch(error => {
          console.error('❌ ERREUR LECTURE:', error);
          if (nextAudio.fallbackText) {
            console.log('🔄 FALLBACK SYNTHÈSE pour:', nextAudio.key);
            speakWithSynthesis(nextAudio.fallbackText);
          }
          audioElementRef.current = null;
          playNextInQueue();
        });
    } catch (error) {
      console.error('❌ ERREUR CRÉATION AUDIO:', error);
      if (nextAudio.fallbackText) {
        speakWithSynthesis(nextAudio.fallbackText);
      }
      playNextInQueue();
    }
  }, [voiceSettings.volume, speakWithSynthesis]);
  
  // Fonction pour ajouter un audio à la file d'attente
  const queueAudio = useCallback((url, key, fallbackText) => {
    console.log('🎵 TENTATIVE LECTURE AUDIO PREMIUM:', url);
    
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log('✅ FICHIER AUDIO PREMIUM TROUVÉ:', url, `(${response.status})`);
          
          audioQueue.current.push({
            url,
            key,
            fallbackText
          });
          
          if (!isPlayingAudio.current) {
            playNextInQueue();
          }
        } else {
          console.log('❌ FICHIER AUDIO PREMIUM NON TROUVÉ:', url, `(${response.status})`);
          
          if (fallbackText) {
            console.log('🔄 FALLBACK SYNTHÈSE pour:', key);
            speakWithSynthesis(fallbackText);
          }
        }
      })
      .catch(error => {
        console.error('❌ ERREUR VÉRIFICATION AUDIO:', error, url);
        
        if (fallbackText) {
          console.log('🔄 FALLBACK SYNTHÈSE pour:', key);
          speakWithSynthesis(fallbackText);
        }
      });
  }, [playNextInQueue, speakWithSynthesis]);
  
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
      console.log(`🧠 SCAN CORPOREL - Audio premium: ${audioPath} (${audioKey})`);
    }
    
    // SYSTÈME PREMIUM POUR MÉDITATIONS
    else if (currentSession === 'meditation' && currentMeditation && audioKey) {
      if (currentMeditation === 'gratitude') {
        audioPath = `/audio/meditation/${gender}/gratitude-${audioKey}.mp3`;
        console.log(`🙏 MÉDITATION GRATITUDE - Audio premium: ${audioPath} (${audioKey})`);
      } else if (currentMeditation === 'abundance') {
        audioPath = `/audio/meditation/${gender}/abundance-${audioKey}.mp3`;
        console.log(`💰 MÉDITATION ABONDANCE - Audio premium: ${audioPath} (${audioKey})`);
      } else if (currentMeditation === 'metatron') {
        // Métatron utilise un fichier complet
        audioPath = `/audio/meditation/${gender}/metatron.mp3`;
        console.log(`🌟 MÉDITATION MÉTATRON - Audio complet: ${audioPath}`);
      }
    }
    
    // SYSTÈME PREMIUM POUR SOS STRESS
    else if (currentSession === 'switch') {
      if (text.includes('Bienvenue dans votre bulle')) {
        audioPath = `/audio/sos-stress/${gender}/welcome.mp3`;
        audioKey = 'welcome';
      } else if (text.includes('Inspirez le calme')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-calm.mp3`;
        audioKey = 'breathe-calm';
      } else if (text.includes('Vos pieds touchent le sol')) {
        audioPath = `/audio/sos-stress/${gender}/grounding.mp3`;
        audioKey = 'grounding';
      } else if (text.includes('Soufflez doucement')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-softly.mp3`;
        audioKey = 'breathe-softly';
      } else if (text.includes('Accueillez l\'air frais')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-fresh.mp3`;
        audioKey = 'breathe-fresh';
      } else if (text.includes('Le stress s\'évapore')) {
        audioPath = `/audio/sos-stress/${gender}/stress-release.mp3`;
        audioKey = 'stress-release';
      } else if (text.includes('Relâchez tout')) {
        audioPath = `/audio/sos-stress/${gender}/breathe-release.mp3`;
        audioKey = 'breathe-release';
      } else if (text.includes('Vous retrouvez votre centre')) {
        audioPath = `/audio/sos-stress/${gender}/center-peace.mp3`;
        audioKey = 'center-peace';
      } else if (text.includes('Parfait. Vous avez retrouvé')) {
        audioPath = `/audio/sos-stress/${gender}/completion.mp3`;
        audioKey = 'completion';
      }
    }
    
    // Si un fichier audio premium a été trouvé, l'utiliser
    if (audioPath && audioKey) {
      console.log(`🎤 PREMIUM: ${audioKey} - ${text.substring(0, 30)}... (${gender})`);
      queueAudio(audioPath, audioKey, text);
    } else {
      // Sinon, utiliser la synthèse vocale
      console.log(`🗣️ SYNTHÈSE: "${text.substring(0, 30)}..."`);
      speakWithSynthesis(text);
    }
  }, [voiceSettings.enabled, voiceSettings.gender, currentSession, currentMeditation, queueAudio, speakWithSynthesis]);
  
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
    
    if (fullAudioRef.current) {
      fullAudioRef.current.pause();
      fullAudioRef.current.src = '';
      fullAudioRef.current = null;
    }
    
    audioQueue.current = [];
    isPlayingAudio.current = false;
    sessionGuidanceStarted.current = false;
    
    // Forcer l'arrêt de toute synthèse vocale
    window.speechSynthesis.cancel();
    
    return true;
  }, [clearAllTimeouts]);
  
  // Fonction pour démarrer le guidage vocal Scan Corporel - SIMPLIFIÉE ET CORRIGÉE
  const startScanGuidance = useCallback(() => {
    console.log('🧠 DÉMARRAGE SCAN CORPOREL - DIAGNOSTIC COMPLET');
    logVoiceState();
    
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
    console.log('🧠 SCAN: Séquence 1 - Accueil (IMMÉDIAT)');
    speak("Bienvenue dans cette séance de scan corporel. Installez-vous confortablement, fermez les yeux si vous le souhaitez.", "welcome");
    
    // TEST IMMÉDIAT - Séquence 2 après 5 secondes pour tester
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: TEST - Séquence 2 (5s)');
      speak("TEST - Portez votre attention sur le sommet de votre tête.", "head");
    }, 5000, "TEST Scan Tête");
    
    // Séquence 2 - Tête (30s)
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 2 - Tête (30s)');
      speak("Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement.", "head");
    }, 30000, "Scan Tête");
    
    // Séquence 3 - Visage (60s)
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 3 - Visage (60s)');
      speak("Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières.", "face");
    }, 60000, "Scan Visage");
    
    // Séquence 4 - Cou (90s)
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 4 - Cou (90s)');
      speak("Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension.", "neck");
    }, 90000, "Scan Cou");
    
    console.log('✅ SCAN CORPOREL: 4 timeouts de test programmés');
    console.log('📊 État final:', {
      voiceEnabled: voiceSettings.enabled,
      sessionActive: isSessionActive,
      timeouts: timeoutsRef.current.length
    });
    
    return true;
  }, [voiceSettings.enabled, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout, logVoiceState]);
  
  // Fonction pour démarrer le guidage vocal SOS Stress
  const startSosStressGuidance = useCallback(() => {
    console.log('🚨 DÉMARRAGE SOS STRESS - DIAGNOSTIC COMPLET');
    logVoiceState();
    
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 SOS: Voix désactivée ou session inactive');
      return false;
    }
    
    console.log('🚨 SOS STRESS - DÉMARRAGE IMMÉDIAT');
    clearAllTimeouts();
    
    // Séquence 1 - Accueil (0.5s)
    createTrackedTimeout(() => {
      speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol.", "welcome");
    }, 500, "SOS Accueil");
    
    // Séquence 2 - Inspiration (12s)
    createTrackedTimeout(() => {
      speak("Inspirez le calme", "breathe-calm");
    }, 12000, "SOS Inspiration");
    
    console.log('✅ SOS STRESS: Timeouts programmés');
    return true;
  }, [voiceSettings.enabled, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout, logVoiceState]);
  
  // Fonction principale pour démarrer le guidage vocal
  const startSessionGuidance = useCallback(() => {
    console.log('🎤 START SESSION GUIDANCE APPELÉ - Session:', currentSession, 'Méditation:', currentMeditation);
    logVoiceState();
    
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
    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL CONFIRMÉ - Session:', currentSession, 'Méditation:', currentMeditation);
    
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
  }, [currentSession, currentMeditation, startSosStressGuidance, startScanGuidance, speak, voiceSettings.enabled, isSessionActive, logVoiceState]);
  
  return {
    speak,
    stop,
    clearAllTimeouts,
    logVoiceState, // NOUVEAU: Fonction de diagnostic
    startSessionGuidance: useCallback(() => {
      console.log('🔄 RESET ET DÉMARRAGE GUIDAGE');
      sessionGuidanceStarted.current = false;
      clearAllTimeouts();
      return startSessionGuidance();
    }, [startSessionGuidance, clearAllTimeouts]),
    isInitialized: isInitialized.current,
  };
};