import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

// Système vocal optimisé pour le scan corporel avec 18 séquences
export const useVoiceManagerScan = () => {
  const { voiceSettings, currentSession, isSessionActive } = useAppStore();
  const scheduledTimeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Chemin des fichiers audio pour le scan corporel
  const getScanAudioPath = (filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/scan-corporel/${gender}/${filename}.mp3`;
  };

  // MAPPING DES FICHIERS SCAN CORPOREL - 18 SÉQUENCES
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

  // Fonction pour vérifier si un fichier audio existe
  const checkAudioFileExists = async (audioPath) => {
    try {
      console.log(`🔍 Vérification fichier: ${audioPath}`);
      const response = await fetch(audioPath, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const exists = response.ok;
      console.log(`${exists ? '✅' : '❌'} Fichier ${audioPath}: ${response.status}`);
      return exists;
    } catch (error) {
      console.log(`❌ Erreur vérification ${audioPath}:`, error.message);
      return false;
    }
  };

  // Fonction pour jouer un fichier audio local AVEC VÉRIFICATION PRÉALABLE
  const playLocalAudio = async (audioPath) => {
    // Vérifier qu'aucun audio n'est en cours
    if (isPlayingRef.current) {
      console.log(`⏸️ Audio en cours, attente pour: ${audioPath}`);
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!isPlayingRef.current) {
            clearInterval(checkInterval);
            playLocalAudio(audioPath).then(resolve);
          }
        }, 100);
      });
    }
    
    // VÉRIFICATION PRÉALABLE DU FICHIER
    const fileExists = await checkAudioFileExists(audioPath);
    if (!fileExists) {
      console.log(`❌ Fichier non trouvé: ${audioPath} - Fallback immédiat`);
      throw new Error(`Fichier non trouvé: ${audioPath}`);
    }
    
    return new Promise((resolve, reject) => {
      console.log(`🎵 Lecture audio: ${audioPath}`);
      
      const audio = new Audio();
      audio.volume = voiceSettings.volume;
      audio.preload = 'auto';
      currentAudioRef.current = audio;
      isPlayingRef.current = true;

      // Timeout de sécurité
      const timeout = setTimeout(() => {
        console.log(`⏰ Timeout lecture: ${audioPath} - Fallback`);
        isPlayingRef.current = false;
        audio.src = '';
        reject(new Error(`Timeout lecture: ${audioPath}`));
      }, 3000);

      audio.oncanplaythrough = () => {
        console.log(`✅ Audio prêt: ${audioPath}`);
        clearTimeout(timeout);
      };

      audio.onended = () => {
        clearTimeout(timeout);
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        console.log(`✅ Audio terminé: ${audioPath}`);
        resolve();
      };

      audio.onerror = (e) => {
        clearTimeout(timeout);
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        console.log(`❌ ERREUR AUDIO PREMIUM: ${audioPath}`, e);
        reject(new Error(`Erreur lecture: ${audioPath}`));
      };

      audio.onloadstart = () => {
        console.log(`🔄 Chargement audio: ${audioPath}`);
      };

      // Définir la source et tenter la lecture
      audio.src = audioPath;
      
      audio.load(); // Forcer le chargement
      
      audio.play().then(() => {
        clearTimeout(timeout);
        console.log(`🔊 Lecture démarrée: ${audioPath}`);
      }).catch((playError) => {
        clearTimeout(timeout);
        isPlayingRef.current = false;
        console.log(`❌ ERREUR PLAY PREMIUM: ${audioPath}`, playError.message);
        reject(playError);
      });
    });
  };

  // Fonction pour synthèse vocale (fallback)
  const speakWithSystemVoice = (text) => {
    // Vérifier qu'aucun audio n'est en cours
    if (isPlayingRef.current) {
      console.log(`⏸️ Audio en cours, attente pour synthèse: "${text}"`);
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
        console.error('❌ Speech Synthesis non supporté');
        reject(new Error('Speech Synthesis non supporté'));
        return;
      }

      console.log(`🗣️ Synthèse vocale: "${text}"`);
      
      // Arrêter toute synthèse en cours
      speechSynthesis.cancel();
      isPlayingRef.current = true;
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Paramètres optimisés pour la relaxation
        utterance.rate = 0.8;  // Débit lent et apaisant
        utterance.pitch = voiceSettings.gender === 'male' ? 0.8 : 1.1;
        utterance.volume = voiceSettings.volume;
        utterance.lang = 'fr-FR';

        // Sélectionner la meilleure voix française
        const voices = speechSynthesis.getVoices();
        const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
        
        if (frenchVoices.length > 0) {
          const preferredVoices = voiceSettings.gender === 'female' 
            ? ['Amélie', 'Marie', 'Audrey', 'Google français', 'Samantha']
            : ['Thomas', 'Nicolas', 'Google français', 'Alex'];
          
          let selectedVoice = null;
          for (const preferred of preferredVoices) {
            selectedVoice = frenchVoices.find(v => v.name.includes(preferred));
            if (selectedVoice) break;
          }
          
          utterance.voice = selectedVoice || frenchVoices[0];
          console.log(`🎤 Voix: ${utterance.voice.name}`);
        }

        utterance.onstart = () => {
          console.log(`🔊 Synthèse démarrée: "${text}"`);
        };

        utterance.onend = () => {
          isPlayingRef.current = false;
          console.log(`✅ Synthèse terminée: "${text}"`);
          resolve();
        };

        utterance.onerror = (event) => {
          isPlayingRef.current = false;
          console.log(`⚠️ Erreur synthèse: "${text}":`, event.error);
          resolve(); // Résoudre quand même pour ne pas bloquer
        };

        speechSynthesis.speak(utterance);
      }, 200);
    });
  };

  // TEXTES EXACTS DE FALLBACK POUR LE SCAN CORPOREL - 18 SÉQUENCES
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

  // Fonction pour jouer un audio SCAN CORPOREL avec fallback
  const playScanAudio = async (audioKey) => {
    console.log(`🧘 Scan Corporel Audio: ${audioKey}`);
    
    try {
      // Essayer d'abord le fichier audio enregistré
      const audioPath = getScanAudioPath(audioKey);
      await playLocalAudio(audioPath);
      console.log(`✅ Fichier audio lu: ${audioKey}`);
    } catch (error) {
      // Fallback vers synthèse vocale
      console.log(`🔄 Fallback synthèse pour: ${audioKey} (${error.message})`);
      const fallbackText = SCAN_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ Fallback réussi: ${audioKey}`);
        } catch (fallbackError) {
          console.error(`❌ Erreur fallback ${audioKey}:`, fallbackError);
        }
      }
    }
  };

  // Fonction principale pour parler
  const speak = (text) => {
    if (!voiceSettings.enabled || !text.trim()) {
      console.log('🔇 Voix désactivée');
      return Promise.resolve();
    }

    console.log(`🗣️ Parole: "${text}"`);
    return speakWithSystemVoice(text);
  };

  // SYSTÈME VOCAL SCAN CORPOREL - 18 SÉQUENCES
  const startScanGuidance = () => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé');
      return;
    }

    console.log(`🧘 DÉMARRAGE SCAN CORPOREL - 18 SÉQUENCES (${voiceSettings.gender})`);
    
    // Nettoyer les anciens timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];
    
    // Timings pour le scan corporel - 18 séquences
    const scanTimings = [
      { time: 0, audioKey: 'welcome', description: 'Bienvenue dans cette séance de scan corporel' },
      { time: 30, audioKey: 'head', description: 'Tête' },
      { time: 60, audioKey: 'face', description: 'Visage' },
      { time: 90, audioKey: 'neck', description: 'Cou et épaules' },
      { time: 120, audioKey: 'chest', description: 'Poitrine' },
      { time: 150, audioKey: 'back', description: 'Dos' },
      { time: 180, audioKey: 'abdomen', description: 'Ventre' },
      { time: 210, audioKey: 'hips', description: 'Hanches et bassin' },
      { time: 240, audioKey: 'thighs', description: 'Cuisses' },
      { time: 255, audioKey: 'knees', description: 'Genoux' },
      { time: 270, audioKey: 'calves', description: 'Mollets' },
      { time: 285, audioKey: 'ankles', description: 'Chevilles' },
      { time: 300, audioKey: 'feet', description: 'Pieds' },
      { time: 360, audioKey: 'wholebody', description: 'Corps entier' },
      { time: 420, audioKey: 'breathing', description: 'Respiration' },
      { time: 480, audioKey: 'awareness', description: 'Prise de conscience' },
      { time: 540, audioKey: 'presence', description: 'Présence' },
      { time: 570, audioKey: 'completion', description: 'Fin de séance' }
    ];
    
    // Programmer les phases du scan corporel
    scanTimings.forEach(({ time, audioKey, description }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          console.log(`🧘 ${time}s: ${audioKey} - ${description}`);
          playScanAudio(audioKey);
        }
      }, time * 1000);
      scheduledTimeoutsRef.current.push(timeout);
    });
    
    console.log(`✅ SCAN CORPOREL PROGRAMMÉ - 18 SÉQUENCES SUR 10 MINUTES`);
  };

  // Arrêter tout
  const stop = () => {
    console.log('🛑 Arrêt système vocal scan corporel');
    
    // Annuler tous les timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];
    
    // Arrêter l'audio en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    
    // Marquer comme non en cours
    isPlayingRef.current = false;
    
    // Arrêter la synthèse
    try {
      speechSynthesis.cancel();
    } catch (error) {
      console.log('⚠️ Erreur arrêt synthèse:', error);
    }
  };

  // Test de disponibilité des fichiers audio pour le scan corporel
  const testScanAudioFiles = async () => {
    console.log('🔍 Test des fichiers audio Scan Corporel...');
    const results = {};
    
    for (const [key, filename] of Object.entries(SCAN_AUDIO_FILES)) {
      const audioPath = getScanAudioPath(filename);
      const exists = await checkAudioFileExists(audioPath);
      results[key] = exists;
    }
    
    const availableCount = Object.values(results).filter(Boolean).length;
    console.log(`📊 Fichiers disponibles: ${availableCount}/${Object.keys(SCAN_AUDIO_FILES).length}`);
    
    return results;
  };

  // Initialisation
  useEffect(() => {
    console.log('🧘 Système vocal scan corporel initialisé - 18 SÉQUENCES');
    
    // Charger les voix système pour le fallback
    const initVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log(`🗣️ ${voices.length} voix système disponibles pour fallback`);
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', initVoices);
    } else {
      initVoices();
    }

    // Test initial des fichiers audio pour Scan Corporel
    if (currentSession === 'scan') {
      testScanAudioFiles();
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
    startScanGuidance,
    playScanAudio,
    getScanAudioPath,
    SCAN_AUDIO_FILES,
    SCAN_FALLBACK_TEXTS,
    testScanAudioFiles,
    checkAudioFileExists,
  };
};