import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

export const useVoiceManager = () => {
  const { voiceSettings, currentSession, isSessionActive } = useAppStore();
  const scheduledTimeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isPlayingRef = useRef(false);

  // SYSTÈME VOCAL POUR VOIX ENREGISTRÉES - TOUS LES FICHIERS PREMIUM
  const getSosAudioPath = (filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/sos-stress/${gender}/${filename}.mp3`;
  };

  // SYSTÈME VOCAL POUR SCAN CORPOREL - TOUS LES FICHIERS PREMIUM
  const getScanAudioPath = (filename) => {
    const gender = voiceSettings.gender; // 'female' ou 'male'
    return `/audio/scan-corporel/${gender}/${filename}.mp3`;
  };

  // MAPPING CORRIGÉ DES FICHIERS SOS STRESS - NOMS EXACTS AVEC TIRETS
  const SOS_AUDIO_FILES = {
    welcome: 'welcome',
    breatheCalm: 'breathe-calm',        // ✅ CORRIGÉ : breathe-calm
    grounding: 'grounding',
    breatheSoftly: 'breathe-softly',    // ✅ CORRIGÉ : breathe-softly
    breatheFresh: 'breathe-fresh',      // ✅ CORRIGÉ : breathe-fresh
    stressRelease: 'stress-release',    // ✅ CORRIGÉ : stress-release
    breatheRelease: 'breathe-release',  // ✅ CORRIGÉ : breathe-release
    centerPeace: 'center-peace',        // ✅ CORRIGÉ : center-peace
    completion: 'completion'
  };

  // MAPPING COMPLET DES FICHIERS SCAN CORPOREL - TOUS LES 18 FICHIERS
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

  // TEXTES EXACTS DE FALLBACK - IDENTIQUES AUX ENREGISTREMENTS
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

  // Fonction pour jouer un fichier audio local AVEC RETRY AMÉLIORÉ
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
    
    return new Promise((resolve, reject) => {
      console.log(`🎵 TENTATIVE LECTURE FICHIER PREMIUM: ${audioPath}`);
      
      const audio = new Audio(audioPath);
      audio.volume = voiceSettings.volume;
      audio.preload = 'auto'; // Précharger l'audio
      currentAudioRef.current = audio;
      isPlayingRef.current = true;

      // Timeout plus long pour les fichiers premium
      const timeout = setTimeout(() => {
        console.log(`⏰ TIMEOUT - Fichier premium non trouvé: ${audioPath}`);
        isPlayingRef.current = false;
        reject(new Error(`Fichier premium non trouvé: ${audioPath}`));
      }, 5000); // 5 secondes au lieu de 2

      audio.oncanplaythrough = () => {
        clearTimeout(timeout);
        console.log(`✅ FICHIER PREMIUM PRÊT: ${audioPath}`);
      };

      audio.onloadstart = () => {
        console.log(`🔄 CHARGEMENT FICHIER PREMIUM: ${audioPath}`);
      };

      audio.onended = () => {
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        console.log(`✅ FICHIER PREMIUM TERMINÉ: ${audioPath}`);
        resolve();
      };

      audio.onerror = (e) => {
        clearTimeout(timeout);
        currentAudioRef.current = null;
        isPlayingRef.current = false;
        console.log(`❌ ERREUR FICHIER PREMIUM: ${audioPath}`, e);
        reject(new Error(`Erreur lecture fichier premium: ${audioPath}`));
      };

      // Tentative de lecture avec gestion d'erreur améliorée
      audio.play().then(() => {
        clearTimeout(timeout);
        console.log(`🔊 LECTURE FICHIER PREMIUM DÉMARRÉE: ${audioPath}`);
      }).catch((playError) => {
        clearTimeout(timeout);
        isPlayingRef.current = false;
        console.log(`❌ ERREUR PLAY FICHIER PREMIUM: ${audioPath}`, playError);
        reject(playError);
      });
    });
  };

  // Fonction pour synthèse vocale (fallback) AMÉLIORÉE
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

      console.log(`🗣️ FALLBACK SYNTHÈSE VOCALE: "${text}"`);
      
      // Arrêter toute synthèse en cours
      speechSynthesis.cancel();
      isPlayingRef.current = true;
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Paramètres optimisés pour Claire et Thierry
        utterance.rate = 0.75;  // Débit lent et apaisant
        utterance.pitch = voiceSettings.gender === 'male' ? 0.85 : 1.1;
        utterance.volume = voiceSettings.volume;
        utterance.lang = 'fr-FR';

        // Sélectionner la meilleure voix française selon le genre
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
          console.log(`🎤 VOIX FALLBACK: ${utterance.voice.name}`);
        }

        utterance.onstart = () => {
          console.log(`🔊 SYNTHÈSE DÉMARRÉE: "${text}"`);
        };

        utterance.onend = () => {
          isPlayingRef.current = false;
          console.log(`✅ SYNTHÈSE TERMINÉE: "${text}"`);
          resolve();
        };

        utterance.onerror = (event) => {
          isPlayingRef.current = false;
          console.log(`⚠️ ERREUR SYNTHÈSE: "${text}":`, event.error);
          resolve(); // Résoudre quand même pour ne pas bloquer
        };

        speechSynthesis.speak(utterance);
      }, 300); // Délai plus long pour éviter les conflits
    });
  };

  // Fonction pour jouer un audio SOS avec fallback INTELLIGENT
  const playSosAudio = async (audioKey) => {
    console.log(`🎯 SOS AUDIO PREMIUM: ${audioKey} (${voiceSettings.gender === 'female' ? 'Claire' : 'Thierry'})`);
    
    try {
      // TOUJOURS essayer d'abord le fichier audio premium
      const audioPath = getSosAudioPath(SOS_AUDIO_FILES[audioKey]); // ✅ UTILISE LE MAPPING CORRIGÉ
      await playLocalAudio(audioPath);
      console.log(`✅ FICHIER PREMIUM UTILISÉ: ${audioKey} → ${SOS_AUDIO_FILES[audioKey]}`);
    } catch (error) {
      // Fallback vers synthèse vocale SEULEMENT si fichier vraiment manquant
      console.log(`🔄 FALLBACK SYNTHÈSE POUR: ${audioKey} - ${error.message}`);
      const fallbackText = SOS_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ FALLBACK SYNTHÈSE RÉUSSI: ${audioKey}`);
        } catch (fallbackError) {
          console.error(`❌ ERREUR FALLBACK ${audioKey}:`, fallbackError);
        }
      } else {
        console.error(`❌ PAS DE TEXTE FALLBACK POUR: ${audioKey}`);
      }
    }
  };

  // Fonction pour jouer un audio SCAN CORPOREL avec fallback INTELLIGENT
  const playScanAudio = async (audioKey) => {
    console.log(`🧘 SCAN CORPOREL AUDIO PREMIUM: ${audioKey} (${voiceSettings.gender === 'female' ? 'Claire' : 'Thierry'})`);
    
    try {
      // TOUJOURS essayer d'abord le fichier audio premium
      const audioPath = getScanAudioPath(SCAN_AUDIO_FILES[audioKey]);
      await playLocalAudio(audioPath);
      console.log(`✅ FICHIER PREMIUM UTILISÉ: ${audioKey}`);
    } catch (error) {
      // Fallback vers synthèse vocale SEULEMENT si fichier vraiment manquant
      console.log(`🔄 FALLBACK SYNTHÈSE POUR: ${audioKey} - ${error.message}`);
      const fallbackText = SCAN_FALLBACK_TEXTS[audioKey];
      if (fallbackText) {
        try {
          await speakWithSystemVoice(fallbackText);
          console.log(`✅ FALLBACK SYNTHÈSE RÉUSSI: ${audioKey}`);
        } catch (fallbackError) {
          console.error(`❌ ERREUR FALLBACK ${audioKey}:`, fallbackError);
        }
      } else {
        console.error(`❌ PAS DE TEXTE FALLBACK POUR: ${audioKey}`);
      }
    }
  };

  // Fonction principale pour parler (autres sessions)
  const speak = (text) => {
    if (!voiceSettings.enabled || !text.trim()) {
      console.log('🔇 Voix désactivée');
      return Promise.resolve();
    }

    console.log(`🗣️ Parole: "${text}"`);
    return speakWithSystemVoice(text);
  };

  // SYSTÈME VOCAL SOS STRESS - TOUS LES FICHIERS PREMIUM UTILISÉS - TIMING CORRIGÉ À 82S
  const startSosGuidance = () => {
    console.log(`🚨 DÉMARRAGE SOS STRESS - FICHIERS PREMIUM COMPLETS (${voiceSettings.gender === 'female' ? 'Claire' : 'Thierry'})`);

    // Nettoyer les anciens timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // SÉQUENCE COMPLÈTE AVEC TOUS LES FICHIERS PREMIUM - TIMING CORRIGÉ
    const sosTimings = [
      { time: 500, audioKey: 'welcome', description: 'Message d\'accueil Claire/Thierry (0.5s)' },
      { time: 12000, audioKey: 'breatheCalm', description: 'Inspirez le calme Claire/Thierry (12s)' },
      { time: 28000, audioKey: 'grounding', description: 'Ancrage Claire/Thierry (28s)' },
      { time: 37000, audioKey: 'breatheSoftly', description: 'Soufflez doucement Claire/Thierry (37s)' },
      { time: 48000, audioKey: 'breatheFresh', description: 'Air frais Claire/Thierry (48s) - PREMIUM' },
      { time: 58000, audioKey: 'stressRelease', description: 'Stress s\'évapore Claire/Thierry (58s) - PREMIUM' },
      { time: 67000, audioKey: 'breatheRelease', description: 'Relâchez tout Claire/Thierry (67s) - PREMIUM' },
      { time: 78000, audioKey: 'centerPeace', description: 'Retrouver le centre Claire/Thierry (78s) - PREMIUM' },
      { time: 82000, audioKey: 'completion', description: 'Message de fin Claire/Thierry (82s) - TIMING CORRIGÉ' }
    ];

    // Programmer tous les messages avec les fichiers premium
    sosTimings.forEach(({ time, audioKey, description }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          console.log(`🎤 ${time/1000}s: ${description}`);
          playSosAudio(audioKey); // Utilise TOUJOURS les fichiers premium d'abord
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });

    console.log(`✅ ${sosTimings.length} GUIDAGES PREMIUM PROGRAMMÉS (Claire/Thierry)`);
    console.log('🎯 Séquence SOS Stress COMPLÈTE : 0.5s → 12s → 28s → 37s → 48s → 58s → 67s → 78s → 82s');
    console.log('🎵 TOUS LES FICHIERS PREMIUM SERONT UTILISÉS - SÉQUENCE 9 CORRIGÉE À 82S');
    console.log('🔧 MAPPING CORRIGÉ : breatheCalm → breathe-calm, breatheSoftly → breathe-softly, etc.');
  };

  // SYSTÈME VOCAL SCAN CORPOREL - TOUS LES FICHIERS PREMIUM UTILISÉS
  const startScanGuidance = () => {
    console.log(`🧘 DÉMARRAGE SCAN CORPOREL - FICHIERS PREMIUM COMPLETS (${voiceSettings.gender === 'female' ? 'Claire' : 'Thierry'})`);

    // Nettoyer les anciens timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // SÉQUENCE COMPLÈTE AVEC TOUS LES FICHIERS PREMIUM - 18 SÉQUENCES
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

    // Programmer tous les messages avec les fichiers premium
    scanTimings.forEach(({ time, audioKey, description }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          console.log(`🧘 ${time}s: ${audioKey} - ${description}`);
          playScanAudio(audioKey); // Utilise TOUJOURS les fichiers premium d'abord
        }
      }, time * 1000);
      
      scheduledTimeoutsRef.current.push(timeout);
    });

    console.log(`✅ ${scanTimings.length} GUIDAGES PREMIUM PROGRAMMÉS (Claire/Thierry)`);
    console.log('🎯 Séquence Scan Corporel COMPLÈTE : 18 séquences sur 10 minutes');
    console.log('🎵 TOUS LES FICHIERS PREMIUM SERONT UTILISÉS');
  };

  // SYSTÈME VOCAL COHÉRENCE CARDIAQUE - SYNTHÈSE VOCALE OPTIMISÉE
  const startCoherenceGuidance = (coherenceSettings) => {
    console.log(`💖 DÉMARRAGE COHÉRENCE CARDIAQUE - GUIDAGE VOCAL (${voiceSettings.gender === 'female' ? 'Claire' : 'Thierry'})`);
    console.log(`💖 Paramètres: ${coherenceSettings.duration}min, rythme ${coherenceSettings.rhythm}`);

    // Nettoyer les anciens timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    if (!voiceSettings.enabled || coherenceSettings.silentMode) {
      console.log('🔇 Guidage vocal désactivé pour la cohérence cardiaque');
      return;
    }

    // Messages de guidance pour la cohérence cardiaque
    const coherenceMessages = {
      welcome: `Session de cohérence cardiaque démarrée. Durée : ${coherenceSettings.duration} minutes. Rythme respiratoire : ${coherenceSettings.rhythm}. Respirez calmement et suivez le guide visuel.`,
      midSession: "Vous êtes dans un excellent rythme. Continuez à respirer calmement. Laissez votre cœur et votre respiration s'harmoniser.",
      finalMinute: "Dernière minute de votre session. Maintenez ce rythme apaisant. Ressentez l'harmonie entre votre cœur et votre respiration.",
      completion: "Session de cohérence cardiaque terminée. Vous avez créé un état d'harmonie intérieure. Gardez cette sensation de calme avec vous."
    };

    // Calculer les timings selon la durée
    const durationMs = coherenceSettings.duration * 60 * 1000;
    const midSessionTime = Math.floor(durationMs * 0.4); // 40% de la session
    const finalMinuteTime = durationMs - 60000; // 1 minute avant la fin

    // Programmer les messages de guidance
    const coherenceTimings = [
      { time: 2000, message: coherenceMessages.welcome, description: 'Message d\'accueil' },
      { time: midSessionTime, message: coherenceMessages.midSession, description: 'Encouragement mi-session' },
      { time: finalMinuteTime, message: coherenceMessages.finalMinute, description: 'Dernière minute' }
    ];

    // Ajouter le message de fin seulement si la session n'est pas trop courte
    if (coherenceSettings.duration >= 2) {
      coherenceTimings.push({ 
        time: durationMs - 5000, 
        message: coherenceMessages.completion, 
        description: 'Message de fin' 
      });
    }

    // Programmer tous les messages
    coherenceTimings.forEach(({ time, message, description }) => {
      const timeout = setTimeout(() => {
        if (isSessionActive) {
          console.log(`💖 ${Math.round(time/1000)}s: ${description}`);
          speakWithSystemVoice(message);
        }
      }, time);
      
      scheduledTimeoutsRef.current.push(timeout);
    });

    console.log(`✅ ${coherenceTimings.length} GUIDAGES COHÉRENCE PROGRAMMÉS`);
    console.log(`💖 Timings: Accueil(2s) → Mi-session(${Math.round(midSessionTime/1000)}s) → Fin(${Math.round(finalMinuteTime/1000)}s)`);
  };

  // SYSTÈME VOCAL UNIFIÉ - GÈRE TOUTES LES SESSIONS
  const startSessionGuidance = (coherenceSettings = null) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé');
      return;
    }

    if (currentSession === 'switch') {
      startSosGuidance();
    } else if (currentSession === 'scan') {
      startScanGuidance();
    } else if (currentSession === 'coherence' && coherenceSettings) {
      startCoherenceGuidance(coherenceSettings);
    } else {
      // Pour les autres sessions, utiliser le système simple
      speak("Session démarrée. Suivez le guide respiratoire.", true);
    }
  };

  // Arrêter tout
  const stop = () => {
    console.log('🛑 Arrêt système vocal');
    
    // Annuler tous les timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];
    
    // Arrêter l'audio en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
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

  // Test de disponibilité des fichiers audio premium
  const testPremiumAudioFiles = async () => {
    console.log('🔍 TEST DES FICHIERS PREMIUM CLAIRE/THIERRY...');
    const results = {};
    
    // Test SOS Stress avec les VRAIS noms de fichiers
    console.log('📁 TEST SOS STRESS - NOMS CORRIGÉS :');
    for (const [key, filename] of Object.entries(SOS_AUDIO_FILES)) {
      const audioPath = getSosAudioPath(filename);
      try {
        const response = await fetch(audioPath, { method: 'HEAD' });
        results[`sos_${key}`] = response.ok;
        console.log(`${response.ok ? '✅' : '❌'} ${audioPath} (${response.status}) - ${key} → ${filename}`);
      } catch (error) {
        results[`sos_${key}`] = false;
        console.log(`❌ ${audioPath} - ${error.message}`);
      }
    }

    // Test Scan Corporel
    console.log('📁 TEST SCAN CORPOREL :');
    for (const [key, filename] of Object.entries(SCAN_AUDIO_FILES)) {
      const audioPath = getScanAudioPath(filename);
      try {
        const response = await fetch(audioPath, { method: 'HEAD' });
        results[`scan_${key}`] = response.ok;
        console.log(`${response.ok ? '✅' : '❌'} ${audioPath} (${response.status})`);
      } catch (error) {
        results[`scan_${key}`] = false;
        console.log(`❌ ${audioPath} - ${error.message}`);
      }
    }
    
    const sosAvailable = Object.keys(results).filter(k => k.startsWith('sos_')).filter(k => results[k]).length;
    const scanAvailable = Object.keys(results).filter(k => k.startsWith('scan_')).filter(k => results[k]).length;
    
    console.log(`📊 FICHIERS SOS PREMIUM DISPONIBLES: ${sosAvailable}/${Object.keys(SOS_AUDIO_FILES).length}`);
    console.log(`📊 FICHIERS SCAN PREMIUM DISPONIBLES: ${scanAvailable}/${Object.keys(SCAN_AUDIO_FILES).length}`);
    
    if (sosAvailable === 9) {
      console.log('🎉 TOUS LES FICHIERS SOS PREMIUM SONT DISPONIBLES !');
    } else {
      console.log('⚠️ CERTAINS FICHIERS SOS PREMIUM MANQUENT - FALLBACK SYNTHÈSE ACTIVÉ');
    }
    
    return results;
  };

  // Initialisation
  useEffect(() => {
    console.log('🎤 Système vocal initialisé - FICHIERS PREMIUM CLAIRE/THIERRY');
    
    // Charger les voix système pour le fallback
    const initVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log(`🗣️ ${voices.length} voix système disponibles`);
      
      // Chercher Claire et Thierry spécifiquement
      const claire = voices.find(v => v.name.includes('Claire'));
      const thierry = voices.find(v => v.name.includes('Thierry'));
      
      if (claire) console.log('✅ Voix Claire trouvée pour fallback féminin');
      if (thierry) console.log('✅ Voix Thierry trouvée pour fallback masculin');
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', initVoices);
    } else {
      initVoices();
    }

    // Test initial des fichiers premium
    if (currentSession === 'switch' || currentSession === 'scan') {
      testPremiumAudioFiles();
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
    startCoherenceGuidance, // Nouvelle fonction pour la cohérence cardiaque
    // Fonctions pour debug et test
    playLocalAudio,
    playSosAudio,
    playScanAudio,
    getSosAudioPath,
    getScanAudioPath,
    testPremiumAudioFiles,
    SOS_AUDIO_FILES,
    SCAN_AUDIO_FILES,
    SOS_FALLBACK_TEXTS,
    SCAN_FALLBACK_TEXTS,
  };
};