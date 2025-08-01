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
  
  // Fonction pour créer un timeout qui sera automatiquement suivi
  const createTrackedTimeout = useCallback((callback, delay) => {
    const timeoutId = setTimeout(() => {
      // Supprimer ce timeout de la liste des timeouts actifs
      timeoutsRef.current = timeoutsRef.current.filter(id => id !== timeoutId);
      callback();
    }, delay);
    
    // Ajouter ce timeout à la liste des timeouts actifs
    timeoutsRef.current.push(timeoutId);
    
    return timeoutId;
  }, []);
  
  // Fonction pour nettoyer tous les timeouts
  const clearAllTimeouts = useCallback(() => {
    console.log(`🧹 Nettoyage de ${timeoutsRef.current.length} timeouts actifs`);
    
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
    sessionGuidanceStarted.current = false;
    clearAllTimeouts();
  }, [currentSession, currentMeditation, clearAllTimeouts]);
  
  // Arrêter le guidage vocal lorsque la session est arrêtée
  useEffect(() => {
    if (!isSessionActive) {
      console.log('🔇 Session inactive - ARRÊT COMPLET du guidage vocal');
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
    if (!voiceSettings.enabled || !text) return;
    
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
        console.log('🗣️ SYNTHÈSE VOCALE:', text.substring(0, 50) + '...');
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
    if (!voiceSettings.enabled || !text) return;
    
    const gender = voiceSettings.gender;
    let audioPath = null;
    
    // SYSTÈME PREMIUM POUR MÉDITATIONS
    if (currentSession === 'meditation' && currentMeditation && audioKey) {
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
    
    // SYSTÈME PREMIUM POUR SCAN CORPOREL
    else if (currentSession === 'scan' && audioKey) {
      audioPath = `/audio/scan-corporel/${gender}/${audioKey}.mp3`;
      console.log(`🧠 SCAN CORPOREL - Audio premium: ${audioPath} (${audioKey})`);
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
  
  // Fonction pour démarrer le guidage vocal SOS Stress
  const startSosStressGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage SOS Stress désactivé');
      return false;
    }
    
    console.log('🚨 DÉMARRAGE SOS STRESS COMPLET');
    clearAllTimeouts();
    
    // Séquence 1 - Accueil (0.5s)
    createTrackedTimeout(() => {
      speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.", "welcome");
    }, 500);
    
    // Séquence 2 - Inspiration (12s)
    createTrackedTimeout(() => {
      speak("Inspirez le calme", "breathe-calm");
    }, 12000);
    
    // Séquence 3 - Ancrage (28s)
    createTrackedTimeout(() => {
      speak("Vos pieds touchent le sol. Vous êtes ancré, solide, stable.", "grounding");
    }, 28000);
    
    // Séquence 4 - Expiration (37s)
    createTrackedTimeout(() => {
      speak("Soufflez doucement", "breathe-softly");
    }, 37000);
    
    // Séquence 5 - Inspiration (48s)
    createTrackedTimeout(() => {
      speak("Accueillez l'air frais", "breathe-fresh");
    }, 48000);
    
    // Séquence 6 - Libération (58s)
    createTrackedTimeout(() => {
      speak("Le stress s'évapore à chaque souffle. Votre corps se détend profondément.", "stress-release");
    }, 58000);
    
    // Séquence 7 - Expiration (67s)
    createTrackedTimeout(() => {
      speak("Relâchez tout", "breathe-release");
    }, 67000);
    
    // Séquence 8 - Recentrage (78s)
    createTrackedTimeout(() => {
      speak("Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.", "center-peace");
    }, 78000);
    
    // Séquence 9 - Fin (85s)
    createTrackedTimeout(() => {
      speak("Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.", "completion");
    }, 85000);
    
    return true;
  }, [voiceSettings.enabled, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction pour démarrer le guidage vocal Scan Corporel
  const startScanGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage Scan désactivé');
      return false;
    }
    
    console.log('🧠 DÉMARRAGE SCAN CORPOREL COMPLET - SYSTÈME CORRIGÉ');
    clearAllTimeouts();
    
    // Séquence 1 - Accueil (0s) - IMMÉDIAT
    console.log('🧠 SCAN: Séquence 1 - Accueil (0s)');
    speak("Bienvenue dans cette séance de scan corporel. Installez-vous confortablement, fermez les yeux si vous le souhaitez. Nous allons explorer chaque partie de votre corps pour une relaxation profonde.", "welcome");
    
    // Séquence 2 - Tête (30s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 2 - Tête (30s)');
      if (!isSessionActive) {
        console.log('⚠️ Session inactive, arrêt du guidage');
        return;
      }
      speak("Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement.", "head");
    }, 30000);
    
    // Séquence 3 - Visage (60s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 3 - Visage (60s)');
      if (!isSessionActive) return;
      speak("Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières. Détendez vos mâchoires, votre langue, votre gorge.", "face");
    }, 60000);
    
    // Séquence 4 - Cou (90s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 4 - Cou (90s)');
      if (!isSessionActive) return;
      speak("Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension accumulée dans cette zone.", "neck");
    }, 90000);
    
    // Séquence 5 - Poitrine (120s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 5 - Poitrine (120s)');
      if (!isSessionActive) return;
      speak("Votre poitrine s'ouvre et se détend à chaque respiration. Sentez l'air qui entre et qui sort librement.", "chest");
    }, 120000);
    
    // Séquence 6 - Dos (150s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 6 - Dos (150s)');
      if (!isSessionActive) return;
      speak("Votre dos se détend vertèbre par vertèbre, du haut vers le bas. Chaque vertèbre s'aligne parfaitement.", "back");
    }, 150000);
    
    // Séquence 7 - Ventre (180s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 7 - Ventre (180s)');
      if (!isSessionActive) return;
      speak("Votre ventre se gonfle et se dégonfle naturellement, sans effort. Sentez une douce chaleur s'y répandre.", "abdomen");
    }, 180000);
    
    // Séquence 8 - Hanches (210s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 8 - Hanches (210s)');
      if (!isSessionActive) return;
      speak("Vos hanches et votre bassin se relâchent complètement. Sentez le poids de votre corps s'enfoncer dans le support.", "hips");
    }, 210000);
    
    // Séquence 9 - Cuisses (240s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 9 - Cuisses (240s)');
      if (!isSessionActive) return;
      speak("Vos cuisses se détendent profondément. Toute tension s'évapore à chaque expiration.", "thighs");
    }, 240000);
    
    // Séquence 10 - Genoux (255s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 10 - Genoux (255s)');
      if (!isSessionActive) return;
      speak("Vos genoux se détendent. Sentez l'espace dans vos articulations.", "knees");
    }, 255000);
    
    // Séquence 11 - Mollets (270s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 11 - Mollets (270s)');
      if (!isSessionActive) return;
      speak("Vos mollets se relâchent entièrement. Sentez l'énergie circuler librement.", "calves");
    }, 270000);
    
    // Séquence 12 - Chevilles (285s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 12 - Chevilles (285s)');
      if (!isSessionActive) return;
      speak("Vos chevilles se détendent. Sentez l'espace dans ces articulations.", "ankles");
    }, 285000);
    
    // Séquence 13 - Pieds (300s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 13 - Pieds (300s)');
      if (!isSessionActive) return;
      speak("Vos pieds, jusqu'au bout de vos orteils, sont maintenant complètement détendus et lourds.", "feet");
    }, 300000);
    
    // Séquence 14 - Corps entier (360s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 14 - Corps entier (360s)');
      if (!isSessionActive) return;
      speak("Une vague de bien-être parcourt maintenant tout votre corps, de la tête aux pieds. Vous êtes dans un état de relaxation profonde.", "wholebody");
    }, 360000);
    
    // Séquence 15 - Respiration (420s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 15 - Respiration (420s)');
      if (!isSessionActive) return;
      speak("Observez votre respiration, calme et régulière. Chaque inspiration vous apporte énergie et vitalité.", "breathing");
    }, 420000);
    
    // Séquence 16 - Conscience (480s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 16 - Conscience (480s)');
      if (!isSessionActive) return;
      speak("Prenez conscience de votre corps dans son ensemble, parfaitement détendu et en harmonie.", "awareness");
    }, 480000);
    
    // Séquence 17 - Présence (540s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 17 - Présence (540s)');
      if (!isSessionActive) return;
      speak("Restez dans cet état de relaxation profonde, en pleine conscience de votre corps et de votre respiration.", "presence");
    }, 540000);
    
    // Séquence 18 - Fin (570s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🧠 SCAN: Séquence 18 - Fin (570s)');
      if (!isSessionActive) return;
      speak("Progressivement, reprenez conscience de votre environnement. Bougez doucement vos doigts, vos orteils. Votre corps est maintenant complètement détendu.", "completion");
    }, 570000);
    
    console.log('✅ SCAN CORPOREL: Tous les timeouts programmés');
    return true;
  }, [voiceSettings.enabled, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction pour démarrer le guidage vocal Gratitude
  const startGratitudeGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage Gratitude désactivé');
      return false;
    }
    
    console.log('🙏 DÉMARRAGE MÉDITATION GRATITUDE COMPLÈTE - SYSTÈME CORRIGÉ');
    clearAllTimeouts();
    
    // Séquence 1 - Installation (0s) - IMMÉDIAT
    console.log('🙏 GRATITUDE: Séquence 1 - Installation (0s)');
    speak("Bienvenue dans cette méditation de gratitude. Installez-vous confortablement, le dos droit, les pieds bien ancrés au sol. Fermez doucement les yeux et prenez conscience de votre respiration naturelle.", "installation");
    
    // Séquence 2 - Cohérence setup (30s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 2 - Cohérence setup (30s)');
      if (!isSessionActive) return;
      speak("Commençons par établir un rythme respiratoire apaisant. Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes...", "coherence-setup");
    }, 30000);
    
    // Séquence 3 - Respiration cœur (60s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 3 - Respiration cœur (60s)');
      if (!isSessionActive) return;
      speak("Portez maintenant votre attention sur votre cœur. Imaginez que vous respirez directement par le centre de votre poitrine.", "breathing-heart");
    }, 60000);
    
    // Séquence 4 - Éveil gratitude (90s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 4 - Éveil gratitude (90s)');
      if (!isSessionActive) return;
      speak("Éveillez maintenant le sentiment de gratitude. Commencez simplement, par les choses les plus évidentes.", "awakening");
    }, 90000);
    
    // Séquence 5 - Première gratitude (120s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 5 - Première gratitude (120s)');
      if (!isSessionActive) return;
      speak("Inspirez... et pensez à une chose pour laquelle vous êtes profondément reconnaissant aujourd'hui. Expirez... et laissez cette gratitude rayonner.", "first");
    }, 120000);
    
    // Séquence 6 - Proches (150s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 6 - Proches (150s)');
      if (!isSessionActive) return;
      speak("Élargissez maintenant votre gratitude vers les personnes qui enrichissent votre vie. Visualisez le visage d'un être cher.", "loved-ones");
    }, 150000);
    
    // Séquence 7 - Corps (180s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 7 - Corps (180s)');
      if (!isSessionActive) return;
      speak("Dirigez maintenant votre gratitude vers votre corps, ce véhicule extraordinaire qui vous permet de vivre chaque expérience.", "body");
    }, 180000);
    
    // Séquence 8 - Nature (210s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 8 - Nature (210s)');
      if (!isSessionActive) return;
      speak("Élargissez encore votre gratitude vers la nature et l'univers. Remerciez le soleil qui vous réchauffe, l'eau qui vous désaltère.", "nature");
    }, 210000);
    
    // Séquence 9 - Ancrage (240s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 9 - Ancrage (240s)');
      if (!isSessionActive) return;
      speak("Ancrez maintenant cette énergie de gratitude dans chaque cellule de votre corps. La gratitude transforme ce que vous avez en suffisance.", "anchoring");
    }, 240000);
    
    // Séquence 10 - Intégration (270s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 10 - Intégration (270s)');
      if (!isSessionActive) return;
      speak("Intégrez pleinement cette énergie de gratitude. Laissez-la rayonner à travers vous, transformant votre perception du monde.", "integration");
    }, 270000);
    
    // Séquence 11 - Conclusion (285s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('🙏 GRATITUDE: Séquence 11 - Conclusion (285s)');
      if (!isSessionActive) return;
      speak("Doucement, prenez une respiration plus profonde. Remerciez-vous pour ce moment de connexion. Quand vous êtes prêt, ouvrez les yeux.", "conclusion");
    }, 285000);
    
    console.log('✅ GRATITUDE: Tous les timeouts programmés');
    return true;
  }, [voiceSettings.enabled, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction pour démarrer le guidage vocal Abondance
  const startAbundanceGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage Abondance désactivé');
      return false;
    }
    
    console.log('💰 DÉMARRAGE MÉDITATION ABONDANCE COMPLÈTE - SYSTÈME CORRIGÉ');
    clearAllTimeouts();
    
    // Séquence 1 - Introduction (0s) - IMMÉDIAT
    console.log('💰 ABONDANCE: Séquence 1 - Introduction (0s)');
    speak("Bienvenue dans cette méditation de cohérence cardiaque intégrative sur la loi de l'attraction. Installez-vous confortablement, le dos droit, les pieds bien ancrés au sol.", "introduction");
    
    // Séquence 2 - Rythme (30s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 2 - Rythme (30s)');
      if (!isSessionActive) return;
      speak("Inspirez profondément par le nez pendant 5 secondes... Expirez doucement par la bouche pendant 5 secondes...", "rhythm-start");
    }, 30000);
    
    // Séquence 3 - Énergie (40s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 3 - Énergie (40s)');
      if (!isSessionActive) return;
      speak("Inspirez... l'univers vous remplit d'énergie positive... Expirez... libérez toute tension...", "energy-breath");
    }, 40000);
    
    // Séquence 4 - Abondance (50s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 4 - Abondance (50s)');
      if (!isSessionActive) return;
      speak("Inspirez... accueillez l'abondance... Expirez... laissez partir les doutes...", "abundance-breath");
    }, 50000);
    
    // Séquence 5 - Cohérence (60s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 5 - Cohérence (60s)');
      if (!isSessionActive) return;
      speak("Votre cœur entre en cohérence, créant un champ magnétique puissant autour de vous.", "coherence");
    }, 60000);
    
    // Séquence 6 - Visualisation (65s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 6 - Visualisation (65s)');
      if (!isSessionActive) return;
      speak("Maintenant, tout en gardant ce rythme respiratoire, visualisez clairement ce que vous désirez manifester.", "visualize");
    }, 65000);
    
    // Séquence 7 - Réalisation (73s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 7 - Réalisation (73s)');
      if (!isSessionActive) return;
      speak("Inspirez... voyez votre désir comme déjà réalisé... Expirez... ressentez la gratitude...", "realization-breath");
    }, 73000);
    
    // Séquence 8 - Cellulaire (83s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 8 - Cellulaire (83s)');
      if (!isSessionActive) return;
      speak("Inspirez... imprégnez chaque cellule de cette vision... Expirez... rayonnez cette énergie...", "cellular-breath");
    }, 83000);
    
    // Séquence 9 - Amplification (93s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 9 - Amplification (93s)');
      if (!isSessionActive) return;
      speak("Votre cœur cohérent amplifie votre pouvoir de manifestation.", "amplify");
    }, 93000);
    
    // Séquence 10 - Mérite (98s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 10 - Mérite (98s)');
      if (!isSessionActive) return;
      speak("Inspirez... Je suis digne de recevoir... Expirez... J'attire naturellement ce qui est bon pour moi...", "worthy-breath");
    }, 98000);
    
    // Séquence 11 - Joie (108s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 11 - Joie (108s)');
      if (!isSessionActive) return;
      speak("Inspirez... sentez la joie de la réalisation... Expirez... ancrez cette certitude...", "joy-breath");
    }, 108000);
    
    // Séquence 12 - Univers (118s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 12 - Univers (118s)');
      if (!isSessionActive) return;
      speak("L'univers conspire en votre faveur. Votre vibration attire ce qui lui correspond.", "universe");
    }, 118000);
    
    // Séquence 13 - Co-création (125s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 13 - Co-création (125s)');
      if (!isSessionActive) return;
      speak("Inspirez... Je co-crée avec l'univers... Expirez... Tout se met en place parfaitement...", "cocreate-breath");
    }, 125000);
    
    // Séquence 14 - Gratitude (135s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 14 - Gratitude (135s)');
      if (!isSessionActive) return;
      speak("Inspirez... amplifiez le sentiment de gratitude... Expirez... diffusez votre lumière...", "gratitude-breath");
    }, 135000);
    
    // Séquence 15 - Cycle manifestation (145s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 15 - Cycle manifestation (145s)');
      if (!isSessionActive) return;
      speak("Continuez ce rythme de respiration consciente. À chaque inspiration, vous attirez vos désirs. À chaque expiration, vous lâchez prise avec confiance.", "manifestation-cycle");
    }, 145000);
    
    // Séquence 16 - Ancrage (300s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 16 - Ancrage (300s)');
      if (!isSessionActive) return;
      speak("Continuez à respirer en cohérence cardiaque, sachant que votre désir est en route vers vous.", "anchor");
    }, 300000);
    
    // Séquence 17 - Alignement (318s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 17 - Alignement (318s)');
      if (!isSessionActive) return;
      speak("Inspirez... Je suis aligné avec mes désirs... Expirez... Je lâche prise avec confiance...", "alignment");
    }, 318000);
    
    // Séquence 18 - Boussole (328s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 18 - Boussole (328s)');
      if (!isSessionActive) return;
      speak("Votre cœur cohérent est votre boussole vers l'abondance.", "compass");
    }, 328000);
    
    // Séquence 19 - Fin (333s) - FORCÉ
    createTrackedTimeout(() => {
      console.log('💰 ABONDANCE: Séquence 19 - Fin (333s)');
      if (!isSessionActive) return;
      speak("Doucement, prenez une respiration plus profonde. Remerciez-vous pour ce moment de connexion et de création.", "completion");
    }, 333000);
    
    console.log('✅ ABONDANCE: Tous les timeouts programmés');
    return true;
  }, [voiceSettings.enabled, isSessionActive, speak, clearAllTimeouts, createTrackedTimeout]);
  
  // Fonction pour démarrer le guidage vocal Métatron
  const startMetatronGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage Métatron désactivé');
      return false;
    }
    
    console.log('🌟 DÉMARRAGE MÉDITATION MÉTATRON');
    clearAllTimeouts();
    
    const gender = voiceSettings.gender;
    const audioPath = `/audio/meditation/${gender}/metatron.mp3`;
    const fallbackText = "Bienvenue dans cette méditation d'invocation de l'archange Métatron. Installez-vous confortablement et fermez les yeux.";
    
    // Essayer de jouer le fichier audio complet
    console.log('🎵 TENTATIVE LECTURE MÉTATRON COMPLET:', audioPath);
    
    fetch(audioPath, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log('✅ FICHIER MÉTATRON TROUVÉ:', audioPath);
          
          const audio = new Audio(audioPath);
          fullAudioRef.current = audio;
          
          audio.onended = () => {
            console.log('✅ MÉDITATION MÉTATRON TERMINÉE');
            fullAudioRef.current = null;
          };
          
          audio.onerror = (error) => {
            console.error('❌ ERREUR AUDIO MÉTATRON:', error);
            speakWithSynthesis(fallbackText);
            fullAudioRef.current = null;
          };
          
          audio.volume = voiceSettings.volume;
          audio.play()
            .catch(error => {
              console.error('❌ ERREUR LECTURE MÉTATRON:', error);
              speakWithSynthesis(fallbackText);
              fullAudioRef.current = null;
            });
        } else {
          console.log('❌ FICHIER MÉTATRON NON TROUVÉ, fallback synthèse');
          speakWithSynthesis(fallbackText);
        }
      })
      .catch(error => {
        console.error('❌ ERREUR VÉRIFICATION MÉTATRON:', error);
        speakWithSynthesis(fallbackText);
      });
    
    return true;
  }, [voiceSettings.enabled, voiceSettings.gender, voiceSettings.volume, isSessionActive, speakWithSynthesis, clearAllTimeouts]);
  
  // Fonction principale pour démarrer le guidage vocal
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage vocal désactivé ou session inactive');
      return false;
    }
    
    if (sessionGuidanceStarted.current) {
      console.log('⚠️ Guidage vocal déjà démarré');
      return false;
    }
    
    sessionGuidanceStarted.current = true;
    console.log('🎤 DÉMARRAGE GUIDAGE - Session:', currentSession, 'Méditation:', currentMeditation);
    
    // Router vers la bonne fonction selon la session
    if (currentSession === 'switch') {
      return startSosStressGuidance();
    } else if (currentSession === 'scan') {
      return startScanGuidance();
    } else if (currentSession === 'meditation' && currentMeditation === 'gratitude') {
      return startGratitudeGuidance();
    } else if (currentSession === 'meditation' && currentMeditation === 'abundance') {
      return startAbundanceGuidance();
    } else if (currentSession === 'meditation' && currentMeditation === 'metatron') {
      return startMetatronGuidance();
    } else {
      // Guidage générique pour les autres sessions
      speak("Bienvenue dans votre session. Suivez le rythme respiratoire et laissez-vous guider.");
      return true;
    }
  }, [currentSession, currentMeditation, startSosStressGuidance, startScanGuidance, startGratitudeGuidance, startAbundanceGuidance, startMetatronGuidance, speak, voiceSettings.enabled, isSessionActive]);
  
  return {
    speak,
    stop,
    clearAllTimeouts,
    startSessionGuidance: useCallback(() => {
      sessionGuidanceStarted.current = false;
      clearAllTimeouts();
      return startSessionGuidance();
    }, [startSessionGuidance, clearAllTimeouts]),
    isInitialized: isInitialized.current,
  };
};