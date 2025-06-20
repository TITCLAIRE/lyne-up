import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

// Système vocal hybride : Fichiers locaux pour SOS Stress + ElevenLabs pour le reste
export const useVoiceManagerLocal = () => {
  const { voiceSettings, currentSession, isSessionActive } = useAppStore();
  const queueRef = useRef([]);
  const isProcessingRef = useRef(false);
  const currentAudioRef = useRef(null);
  
  // Système pour SOS Stress avec fichiers locaux
  const sessionStartTimeRef = useRef(0);
  const scheduledTimeoutsRef = useRef([]);

  // Mapping des audios SOS Stress avec dossiers séparés
  const getSosAudioPath = (filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/sos-stress/${gender}/${filename}.mp3`;
  };

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

  // Fonction pour jouer un fichier audio local
  const playLocalAudio = async (audioKey) => {
    const audioPath = getSosAudioPath(audioKey);
    
    return new Promise((resolve, reject) => {
      console.log(`🎵 Tentative lecture audio local: ${audioPath}`);
      
      const audio = new Audio(audioPath);
      audio.volume = voiceSettings.volume;
      currentAudioRef.current = audio;

      // Test de disponibilité du fichier
      const testTimeout = setTimeout(() => {
        console.error(`⏰ Timeout chargement audio: ${audioPath}`);
        reject(new Error(`Fichier non trouvé: ${audioPath}`));
      }, 3000);

      audio.oncanplay = () => {
        clearTimeout(testTimeout);
        console.log(`✅ Audio prêt: ${audioPath}`);
      };

      audio.onended = () => {
        currentAudioRef.current = null;
        console.log(`✅ Audio terminé: ${audioPath}`);
        resolve();
      };

      audio.onerror = (e) => {
        clearTimeout(testTimeout);
        currentAudioRef.current = null;
        console.error(`❌ Erreur audio: ${audioPath}`, e);
        reject(new Error(`Erreur lecture audio: ${audioPath}`));
      };

      audio.onloadstart = () => {
        console.log(`🔄 Chargement audio: ${audioPath}`);
      };

      // Tentative de lecture
      audio.play().then(() => {
        clearTimeout(testTimeout);
        console.log(`🔊 Lecture démarrée: ${audioPath}`);
      }).catch((playError) => {
        clearTimeout(testTimeout);
        console.error(`❌ Erreur play: ${audioPath}`, playError);
        reject(playError);
      });
    });
  };

  // Fonction pour parler avec ElevenLabs (pour les autres sessions)
  const speakWithElevenLabs = async (text) => {
    const apiKey = import.meta.env.VITE_AUDIO_SERVICE_TOKEN || 
                   import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
      console.warn('⚠️ Clé API manquante, utilisation des voix système');
      return speakWithSystemVoice(text);
    }

    try {
      const voice = voiceSettings.gender === 'female' 
        ? { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' }
        : { voice_id: 'VR6AewLTigWG4xSOukaG', name: 'Josh' };

      console.log(`🎤 ElevenLabs: Génération pour "${text}" avec ${voice.name}`);
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: preprocessText(text),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.85,
            similarity_boost: 0.8,
            style: 0.15,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.volume = voiceSettings.volume;
      currentAudioRef.current = audio;

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          currentAudioRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          currentAudioRef.current = null;
          reject(new Error('Erreur lecture audio ElevenLabs'));
        };
        audio.play().catch(reject);
      });

    } catch (error) {
      console.error('❌ Erreur ElevenLabs:', error);
      return speakWithSystemVoice(text);
    }
  };

  // Préprocesser le texte
  const preprocessText = (text) => {
    return text.trim()
      .replace(/\.\.\./g, '... ')
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
      .replace(/\./g, '... ')
      .replace(/,/g, ', ')
      .replace(/:/g, ': ');
  };

  // Fonction pour parler avec les voix système (fallback) - AMÉLIORÉE
  const speakWithSystemVoice = (text) => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        console.error('❌ Speech Synthesis non supporté');
        reject(new Error('Speech Synthesis non supporté'));
        return;
      }

      console.log(`🗣️ Voix système: "${text}"`);
      
      // Arrêter toute synthèse en cours
      speechSynthesis.cancel();
      
      // Attendre un peu pour éviter les conflits
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 0.75;
        utterance.pitch = voiceSettings.gender === 'male' ? 0.85 : 1.0;
        utterance.volume = voiceSettings.volume;
        utterance.lang = 'fr-FR';

        // Sélectionner la meilleure voix française
        const voices = speechSynthesis.getVoices();
        console.log(`🎤 Voix disponibles: ${voices.length}`);
        
        const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
        console.log(`🇫🇷 Voix françaises: ${frenchVoices.length}`);
        
        if (frenchVoices.length > 0) {
          const preferredVoices = voiceSettings.gender === 'female' 
            ? ['Amélie', 'Marie', 'Audrey', 'Google français', 'Samantha', 'Virginie']
            : ['Thomas', 'Nicolas', 'Google français', 'Alex', 'Daniel'];
          
          let selectedVoice = null;
          for (const preferred of preferredVoices) {
            selectedVoice = frenchVoices.find(v => v.name.includes(preferred));
            if (selectedVoice) break;
          }
          
          utterance.voice = selectedVoice || frenchVoices[0];
          console.log(`🎤 Voix sélectionnée: ${utterance.voice.name}`);
        } else {
          console.warn('⚠️ Aucune voix française trouvée, utilisation de la voix par défaut');
        }

        utterance.onstart = () => {
          console.log(`🔊 Voix système démarrée: "${text}"`);
        };

        utterance.onend = () => {
          console.log(`✅ Voix système terminée: "${text}"`);
          resolve();
        };

        utterance.onerror = (event) => {
          console.error(`❌ Erreur voix système: "${text}":`, event.error);
          reject(new Error(`Erreur voix système: ${event.error}`));
        };

        // Test si les voix sont chargées
        if (voices.length === 0) {
          console.log('🔄 Attente du chargement des voix...');
          speechSynthesis.addEventListener('voiceschanged', () => {
            console.log('✅ Voix chargées, nouvelle tentative');
            speechSynthesis.speak(utterance);
          }, { once: true });
        } else {
          speechSynthesis.speak(utterance);
        }
      }, 200);
    });
  };

  // Mapping des textes de fallback pour SOS Stress
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

  // Fonction pour jouer un audio SOS avec fallback automatique - AMÉLIORÉE
  const playSosAudio = async (audioKey) => {
    console.log(`🎯 Tentative lecture SOS: ${audioKey}`);
    
    try {
      // Essayer d'abord le fichier local
      await playLocalAudio(audioKey);
      console.log(`✅ Fichier local lu avec succès: ${audioKey}`);
    } catch (error) {
      // Fallback vers synthèse vocale si fichier manquant
      console.log(`🔄 Fallback vers synthèse vocale pour: ${audioKey} (${error.message})`);
      const fallbackText = SOS_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          if (voiceSettings.useElevenLabs) {
            await speakWithElevenLabs(fallbackText);
          } else {
            await speakWithSystemVoice(fallbackText);
          }
          console.log(`✅ Fallback réussi pour: ${audioKey}`);
        } catch (fallbackError) {
          console.error(`❌ Erreur fallback pour ${audioKey}:`, fallbackError);
        }
      } else {
        console.error(`❌ Pas de texte de fallback pour: ${audioKey}`);
      }
    }
  };

  // Fonction principale pour parler
  const speak = async (text, priority = false) => {
    if (!voiceSettings.enabled || !text.trim()) {
      console.log('🔇 Voix désactivée ou texte vide');
      return;
    }

    console.log(`🎯 Demande de parole: "${text}" (priority: ${priority})`);

    const message = { text: text.trim(), priority };

    if (priority) {
      stop();
      queueRef.current.unshift(message);
    } else {
      queueRef.current.push(message);
    }

    processQueue();
  };

  // Traiter la queue de messages
  const processQueue = async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const message = queueRef.current.shift();
    
    if (!message) {
      isProcessingRef.current = false;
      return;
    }

    try {
      console.log(`🎯 Traitement message: "${message.text}"`);
      
      // Pour SOS Stress, on utilise les fichiers locaux si disponibles
      if (currentSession === 'sos') {
        // Les audios SOS sont gérés par le système de timings programmés
        // Cette fonction n'est utilisée que pour les messages génériques
        await speakWithSystemVoice(message.text);
      } else {
        // Pour les autres sessions, utiliser ElevenLabs ou voix système
        if (voiceSettings.useElevenLabs) {
          await speakWithElevenLabs(message.text);
        } else {
          await speakWithSystemVoice(message.text);
        }
      }
    } catch (error) {
      console.error('❌ Erreur synthèse vocale:', error);
    }

    isProcessingRef.current = false;
    
    setTimeout(() => {
      processQueue();
    }, 800);
  };

  // SYSTÈME VOCAL SOS STRESS - FICHIERS LOCAUX AVEC FALLBACK
  const startSessionGuidance = () => {
    if (currentSession !== 'sos') {
      speak("Session démarrée. Suivez le guide respiratoire.", true);
      return;
    }

    console.log(`🚨 DÉMARRAGE SOS STRESS - FICHIERS AUDIO LOCAUX (${voiceSettings.gender})`);
    sessionStartTimeRef.current = Date.now();

    // Nettoyer les anciens timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // MESSAGE DE DÉMARRAGE IMMÉDIAT - FICHIER LOCAL
    const welcomeTimeout = setTimeout(() => {
      if (isSessionActive) {
        playSosAudio('welcome');
      }
    }, 0);

    // GUIDAGES RESPIRATOIRES - FICHIERS LOCAUX
    const breathingTimeout1 = setTimeout(() => {
      if (isSessionActive) {
        playSosAudio('breatheCalm');
      }
    }, 10000); // 10s

    const breathingTimeout2 = setTimeout(() => {
      if (isSessionActive) {
        playSosAudio('breatheSoftly');
      }
    }, 35000); // 35s

    const breathingTimeout3 = setTimeout(() => {
      if (isSessionActive) {
        playSosAudio('breatheFresh');
      }
    }, 50000); // 50s

    const breathingTimeout4 = setTimeout(() => {
      if (isSessionActive) {
        playSosAudio('breatheRelease');
      }
    }, 65000); // 65s

    // MESSAGES DE PHASES - FICHIERS LOCAUX
    const phaseTimeout1 = setTimeout(() => {
      if (isSessionActive) {
        playSosAudio('grounding');
      }
    }, 30000); // 30s

    const phaseTimeout2 = setTimeout(() => {
      if (isSessionActive) {
        playSosAudio('stressRelease');
      }
    }, 55000); // 55s

    const phaseTimeout3 = setTimeout(() => {
      if (isSessionActive) {
        playSosAudio('centerPeace');
      }
    }, 80000); // 80s

    // MESSAGE DE FIN - FICHIER LOCAL
    const endTimeout = setTimeout(() => {
      playSosAudio('completion');
    }, 90000); // 90s

    // Stocker tous les timeouts
    scheduledTimeoutsRef.current = [
      welcomeTimeout, breathingTimeout1, breathingTimeout2, breathingTimeout3, breathingTimeout4,
      phaseTimeout1, phaseTimeout2, phaseTimeout3, endTimeout
    ];

    console.log('✅ SYSTÈME VOCAL SOS STRESS PROGRAMMÉ - FICHIERS LOCAUX + FALLBACK INTELLIGENT');
  };

  // Arrêter la synthèse vocale
  const stop = () => {
    console.log('🛑 Arrêt système vocal');
    queueRef.current = [];
    
    // Annuler tous les timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];
    
    // Arrêter l'audio en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Arrêter les voix système
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    isProcessingRef.current = false;
  };

  // Test de connexion ElevenLabs
  const testElevenLabsConnection = async () => {
    const apiKey = import.meta.env.VITE_AUDIO_SERVICE_TOKEN || 
                   import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
      return false;
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: { 'xi-api-key': apiKey }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Test de disponibilité des fichiers audio - AMÉLIORÉ
  const testAudioFiles = async () => {
    console.log('🔍 Test des fichiers audio SOS Stress...');
    const results = {};
    
    for (const [key, filename] of Object.entries(SOS_AUDIO_FILES)) {
      const audioPath = getSosAudioPath(filename);
      try {
        const response = await fetch(audioPath, { method: 'HEAD' });
        results[key] = response.ok;
        console.log(`${response.ok ? '✅' : '❌'} ${audioPath} (${response.status})`);
      } catch (error) {
        results[key] = false;
        console.log(`❌ ${audioPath} - ${error.message}`);
      }
    }
    
    const availableCount = Object.values(results).filter(Boolean).length;
    console.log(`📊 Fichiers disponibles: ${availableCount}/${Object.keys(SOS_AUDIO_FILES).length}`);
    
    return results;
  };

  // Test simple des voix système
  const testSystemVoice = () => {
    console.log('🔍 Test des voix système...');
    try {
      const utterance = new SpeechSynthesisUtterance("Test des voix système");
      utterance.volume = 0.5;
      utterance.rate = 0.8;
      utterance.lang = 'fr-FR';
      
      utterance.onstart = () => console.log('✅ Voix système fonctionnelle');
      utterance.onerror = (e) => console.error('❌ Erreur voix système:', e.error);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('❌ Voix système non disponible:', error);
    }
  };

  // Initialisation
  useEffect(() => {
    // Charger les voix système
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        console.log('🗣️ Voix système chargées:', speechSynthesis.getVoices().length);
      });
    }

    // Test initial des fichiers audio pour SOS Stress
    if (currentSession === 'sos') {
      testAudioFiles();
    }

    return () => {
      stop();
    };
  }, [currentSession]);

  return {
    speak,
    stop,
    isProcessing: isProcessingRef.current,
    startSessionGuidance,
    testElevenLabsConnection,
    testAudioFiles,
    testSystemVoice,
    // Nouvelles fonctions pour les fichiers locaux
    playLocalAudio,
    playSosAudio,
    getSosAudioPath,
    SOS_AUDIO_FILES,
    SOS_FALLBACK_TEXTS,
  };
};