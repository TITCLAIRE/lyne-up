import { useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export function useVoiceManager() {
  const { voiceSettings, currentSession, currentMeditation, isSessionActive } = useAppStore();

  // Ref pour gérer les timeouts de guidage vocal
  const timeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  const isGuidanceStartedRef = useRef(false);
  
  const clearAllTimeouts = useCallback(() => {
    console.log('🧹 Nettoyage de tous les timeouts:', timeoutsRef.current.length);
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
    
    // Arrêter l'audio en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Reset du flag de démarrage
    isGuidanceStartedRef.current = false;
  }, []);
  
  const speak = useCallback((text, delay = 0) => {
    // SYNTHÈSE VOCALE COMPLÈTEMENT DÉSACTIVÉE
    console.log('🔇 Synthèse vocale désactivée - Utilisation voix premium uniquement');
    return;
  }, []);

  const stopVoice = useCallback(() => {
    console.log('🔇 ARRÊT COMPLET DU SYSTÈME VOCAL');
    
    // Arrêter la synthèse vocale
    window.speechSynthesis.cancel();
    
    // Arrêter l'audio premium
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Nettoyer tous les timeouts
    clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Surveiller l'état de la session pour arrêter les guidances
  useEffect(() => {
    if (!isSessionActive && isGuidanceStartedRef.current) {
      console.log('🔇 Session inactive détectée - Arrêt du guidage vocal');
      stopVoice();
    }
  }, [isSessionActive, stopVoice]);

  const tryPremiumAudio = useCallback(async (audioKey, fallbackText, timing) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Voix désactivée, pas de lecture premium');
      return false;
    }

    const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
    const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
    
    // Déterminer le bon dossier selon le type de fichier
    let audioPath;
    if (audioKey.startsWith('gratitude-') || audioKey.startsWith('abundance-')) {
      audioPath = `/audio/meditation/${gender}/${audioKey}.mp3`;
    } else if (audioKey === 'metatron') {
      audioPath = `/audio/meditation/${gender}/${audioKey}.mp3`;
    } else if (audioKey.includes('head') || audioKey.includes('face') || audioKey.includes('neck') || 
               audioKey.includes('chest') || audioKey.includes('back') || audioKey.includes('abdomen') || 
               audioKey.includes('hips') || audioKey.includes('thighs') || audioKey.includes('feet') || 
               audioKey.includes('wholebody') || audioKey.includes('awareness') || audioKey.includes('breathing') ||
               audioKey.includes('presence') || audioKey.includes('completion') || audioKey.includes('calves') ||
               audioKey.includes('ankles') || audioKey.includes('knees')) {
      audioPath = `/audio/scan-corporel/${gender}/${audioKey}.mp3`;
    } else {
      audioPath = `/audio/sos-stress/${gender}/${audioKey}.mp3`;
    }
    
    console.log(`🎵 TENTATIVE LECTURE PREMIUM: ${audioPath} (${voiceName})`);
    
    try {
      // Test de l'existence du fichier
      const response = await fetch(audioPath, { method: 'HEAD' });
      
      if (!response.ok) {
        console.log(`❌ FICHIER NON TROUVÉ: ${audioPath} (${response.status})`);
        return false;
      }
      
      console.log(`✅ FICHIER TROUVÉ: ${audioPath} (${response.status})`);
      
      // Créer et jouer l'audio
      const audio = new Audio(audioPath);
      audio.volume = voiceSettings.volume;
      currentAudioRef.current = audio;
      
      return new Promise((resolve) => {
        audio.oncanplaythrough = async () => {
          try {
            await audio.play();
            console.log(`🔊 LECTURE PREMIUM DÉMARRÉE: ${audioPath}`);
            
            audio.onended = () => {
              console.log(`✅ AUDIO PREMIUM TERMINÉ: ${audioKey}`);
              currentAudioRef.current = null;
              resolve(true);
            };
            
          } catch (playError) {
            console.log(`❌ ERREUR LECTURE: ${audioKey}`);
            resolve(false);
          }
        };
        
        audio.onerror = () => {
          console.log(`❌ ERREUR AUDIO: ${audioKey}`);
          resolve(false);
        };
        
        // Timeout de sécurité
        setTimeout(() => {
          console.log(`⏰ TIMEOUT: ${audioKey}`);
          resolve(false);
        }, 3000);
        
        audio.load();
      });
      
    } catch (error) {
      console.log(`❌ ERREUR RÉSEAU: ${audioKey}`);
      return false;
    }
  }, [voiceSettings]);
  
  const startSessionGuidance = useCallback(() => {
    // Éviter les démarrages multiples
    if (isGuidanceStartedRef.current) {
      console.log('🔇 Guidage vocal déjà démarré, ignoré');
      return false;
    }
    
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé dans les paramètres');
      return false;
    }
    
    isGuidanceStartedRef.current = true;
    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession);

    // Démarrage spécifique pour SOS Stress (session SWITCH)
    if (currentSession === 'switch') {
      console.log('🚨 DÉMARRAGE SOS STRESS - VOIX PREMIUM UNIQUEMENT');
      
      // Séquence 1 : Message d'accueil (0.5s)
      const timeoutId1 = setTimeout(async () => {
        await tryPremiumAudio('welcome', "", 500);
      }, 500);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Guidage respiratoire (12s)
      const timeoutId2 = setTimeout(async () => {
        await tryPremiumAudio('breathe-calm', "", 12000);
      }, 12000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Ancrage (28s)
      const timeoutId3 = setTimeout(async () => {
        await tryPremiumAudio('grounding', "", 28000);
      }, 28000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Guidage respiratoire (37s)
      const timeoutId4 = setTimeout(async () => {
        await tryPremiumAudio('breathe-softly', "", 37000);
      }, 37000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Message de fin (85s)
      const timeoutId5 = setTimeout(async () => {
        await tryPremiumAudio('completion', "", 85000);
      }, 85000);
      timeoutsRef.current.push(timeoutId5);
        
    } else if (currentSession === 'scan') {
      console.log('🧘 DÉMARRAGE SCAN CORPOREL - VOIX PREMIUM UNIQUEMENT');
      
      // Séquence 1 : Message d'accueil (0s)
      const timeoutId1 = setTimeout(async () => {
        await tryPremiumAudio('welcome', "");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Tête (30s)
      const timeoutId2 = setTimeout(async () => {
        await tryPremiumAudio('head', "");
      }, 30000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Visage (60s)
      const timeoutId3 = setTimeout(async () => {
        await tryPremiumAudio('face', "");
      }, 60000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Cou (90s)
      const timeoutId4 = setTimeout(async () => {
        await tryPremiumAudio('neck', "");
      }, 90000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Poitrine (120s)
      const timeoutId5 = setTimeout(async () => {
        await tryPremiumAudio('chest', "");
      }, 120000);
      timeoutsRef.current.push(timeoutId5);
      
      // Séquence 6 : Dos (150s)
      const timeoutId6 = setTimeout(async () => {
        await tryPremiumAudio('back', "");
      }, 150000);
      timeoutsRef.current.push(timeoutId6);
      
      // Séquence 7 : Ventre (180s)
      const timeoutId7 = setTimeout(async () => {
        await tryPremiumAudio('abdomen', "");
      }, 180000);
      timeoutsRef.current.push(timeoutId7);
      
      // Séquence 8 : Hanches (210s)
      const timeoutId8 = setTimeout(async () => {
        await tryPremiumAudio('hips', "");
      }, 210000);
      timeoutsRef.current.push(timeoutId8);
      
      // Séquence 9 : Cuisses (240s)
      const timeoutId9 = setTimeout(async () => {
        await tryPremiumAudio('thighs', "");
      }, 240000);
      timeoutsRef.current.push(timeoutId9);
      
      // Séquence 10 : Genoux (255s)
      const timeoutId10 = setTimeout(async () => {
        await tryPremiumAudio('knees', "");
      }, 255000);
      timeoutsRef.current.push(timeoutId10);
      
      // Séquence 11 : Mollets (270s)
      const timeoutId11 = setTimeout(async () => {
        await tryPremiumAudio('calves', "");
      }, 270000);
      timeoutsRef.current.push(timeoutId11);
      
      // Séquence 12 : Chevilles (285s)
      const timeoutId12 = setTimeout(async () => {
        await tryPremiumAudio('ankles', "");
      }, 285000);
      timeoutsRef.current.push(timeoutId12);
      
      // Séquence 13 : Pieds (300s)
      const timeoutId13 = setTimeout(async () => {
        await tryPremiumAudio('feet', "");
      }, 300000);
      timeoutsRef.current.push(timeoutId13);
      
      // Séquence 14 : Corps entier (360s)
      const timeoutId14 = setTimeout(async () => {
        await tryPremiumAudio('wholebody', "");
      }, 360000);
      timeoutsRef.current.push(timeoutId14);
      
      // Séquence 15 : Respiration (420s)
      const timeoutId15 = setTimeout(async () => {
        await tryPremiumAudio('breathing', "");
      }, 420000);
      timeoutsRef.current.push(timeoutId15);
      
      // Séquence 16 : Conscience (480s)
      const timeoutId16 = setTimeout(async () => {
        await tryPremiumAudio('awareness', "");
      }, 480000);
      timeoutsRef.current.push(timeoutId16);
      
      // Séquence 17 : Présence (540s)
      const timeoutId17 = setTimeout(async () => {
        await tryPremiumAudio('presence', "");
      }, 540000);
      timeoutsRef.current.push(timeoutId17);
      
      // Séquence 18 : Fin (570s)
      const timeoutId18 = setTimeout(async () => {
        await tryPremiumAudio('completion', "");
      }, 570000);
      timeoutsRef.current.push(timeoutId18);
        
    } else if (currentSession === 'meditation' && currentMeditation === 'gratitude') {
      console.log('🙏 DÉMARRAGE MÉDITATION GRATITUDE - VOIX PREMIUM UNIQUEMENT');
      
      // Séquence 1 : Installation (0s)
      const timeoutId1 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-installation', "");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Cohérence (30s)
      const timeoutId2 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-coherence-setup', "");
      }, 30000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Respiration cœur (60s)
      const timeoutId3 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-breathing-heart', "");
      }, 60000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Éveil gratitude (90s)
      const timeoutId4 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-awakening', "");
      }, 90000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Première gratitude (120s)
      const timeoutId5 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-first', "");
      }, 120000);
      timeoutsRef.current.push(timeoutId5);
      
      // Séquence 6 : Êtres chers (150s)
      const timeoutId6 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-loved-ones', "");
      }, 150000);
      timeoutsRef.current.push(timeoutId6);
      
      // Séquence 7 : Corps (180s)
      const timeoutId7 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-body', "");
      }, 180000);
      timeoutsRef.current.push(timeoutId7);
      
      // Séquence 8 : Nature (210s)
      const timeoutId8 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-nature', "");
      }, 210000);
      timeoutsRef.current.push(timeoutId8);
      
      // Séquence 9 : Ancrage (240s)
      const timeoutId9 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-anchoring', "");
      }, 240000);
      timeoutsRef.current.push(timeoutId9);
      
      // Séquence 10 : Intégration (270s)
      const timeoutId10 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-integration', "");
      }, 270000);
      timeoutsRef.current.push(timeoutId10);
      
      // Séquence 11 : Conclusion (285s)
      const timeoutId11 = setTimeout(async () => {
        await tryPremiumAudio('gratitude-conclusion', "");
      }, 285000);
      timeoutsRef.current.push(timeoutId11);
        
    } else if (currentSession === 'meditation' && currentMeditation === 'abundance') {
      console.log('💰 DÉMARRAGE MÉDITATION ABONDANCE - VOIX PREMIUM UNIQUEMENT');
      
      // Séquence 1 : Introduction (0s)
      const timeoutId1 = setTimeout(async () => {
        await tryPremiumAudio('abundance-introduction', "");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Rythme (30s)
      const timeoutId2 = setTimeout(async () => {
        await tryPremiumAudio('abundance-rhythm-start', "");
      }, 30000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Énergie (40s)
      const timeoutId3 = setTimeout(async () => {
        await tryPremiumAudio('abundance-energy-breath', "");
      }, 40000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Abondance (50s)
      const timeoutId4 = setTimeout(async () => {
        await tryPremiumAudio('abundance-abundance-breath', "");
      }, 50000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Cohérence (60s)
      const timeoutId5 = setTimeout(async () => {
        await tryPremiumAudio('abundance-coherence', "");
      }, 60000);
      timeoutsRef.current.push(timeoutId5);
      
      // Séquence 6 : Visualisation (65s)
      const timeoutId6 = setTimeout(async () => {
        await tryPremiumAudio('abundance-visualize', "");
      }, 65000);
      timeoutsRef.current.push(timeoutId6);
      
      // Séquence 7 : Réalisation (73s)
      const timeoutId7 = setTimeout(async () => {
        await tryPremiumAudio('abundance-realization-breath', "");
      }, 73000);
      timeoutsRef.current.push(timeoutId7);
      
      // Séquence 8 : Cellulaire (83s)
      const timeoutId8 = setTimeout(async () => {
        await tryPremiumAudio('abundance-cellular-breath', "");
      }, 83000);
      timeoutsRef.current.push(timeoutId8);
      
      // Séquence 9 : Amplification (93s)
      const timeoutId9 = setTimeout(async () => {
        await tryPremiumAudio('abundance-amplify', "");
      }, 93000);
      timeoutsRef.current.push(timeoutId9);
      
      // Séquence 10 : Mérite (98s)
      const timeoutId10 = setTimeout(async () => {
        await tryPremiumAudio('abundance-worthy-breath', "");
      }, 98000);
      timeoutsRef.current.push(timeoutId10);
      
      // Séquence 11 : Joie (108s)
      const timeoutId11 = setTimeout(async () => {
        await tryPremiumAudio('abundance-joy-breath', "");
      }, 108000);
      timeoutsRef.current.push(timeoutId11);
      
      // Séquence 12 : Univers (118s)
      const timeoutId12 = setTimeout(async () => {
        await tryPremiumAudio('abundance-universe', "");
      }, 118000);
      timeoutsRef.current.push(timeoutId12);
      
      // Séquence 13 : Co-création (125s)
      const timeoutId13 = setTimeout(async () => {
        await tryPremiumAudio('abundance-cocreate-breath', "");
      }, 125000);
      timeoutsRef.current.push(timeoutId13);
      
      // Séquence 14 : Gratitude (135s)
      const timeoutId14 = setTimeout(async () => {
        await tryPremiumAudio('abundance-gratitude-breath', "");
      }, 135000);
      timeoutsRef.current.push(timeoutId14);
      
      // Séquence 15 : Cycle de manifestation (145s)
      const timeoutId15 = setTimeout(async () => {
        await tryPremiumAudio('abundance-manifestation-cycle', "");
      }, 145000);
      timeoutsRef.current.push(timeoutId15);
      
      // Séquence 16 : Ancrage (265s) - TIMING CORRIGÉ
      const timeoutId16 = setTimeout(async () => {
        await tryPremiumAudio('abundance-anchor', "");
      }, 265000);
      timeoutsRef.current.push(timeoutId16);
      
      // Séquence 17 : Alignement (283s) - TIMING CORRIGÉ
      const timeoutId17 = setTimeout(async () => {
        await tryPremiumAudio('abundance-alignment', "");
      }, 283000);
      timeoutsRef.current.push(timeoutId17);
      
      // Séquence 18 : Boussole (293s) - TIMING CORRIGÉ
      const timeoutId18 = setTimeout(async () => {
        await tryPremiumAudio('abundance-compass', "");
      }, 293000);
      timeoutsRef.current.push(timeoutId18);
      
      // Séquence 19 : Completion (298s) - TIMING CORRIGÉ
      const timeoutId19 = setTimeout(async () => {
        await tryPremiumAudio('abundance-completion', "");
      }, 298000);
      timeoutsRef.current.push(timeoutId19);
        
    } else if (currentSession === 'meditation' && currentMeditation === 'metatron') {
      console.log('🌟 DÉMARRAGE MÉDITATION MÉTATRON - VOIX PREMIUM UNIQUEMENT');
      
      // Fichier audio complet
      const timeoutId1 = setTimeout(async () => {
        await tryPremiumAudio('metatron', "");
      }, 1000);
      timeoutsRef.current.push(timeoutId1);
        
    } else {
      console.log('🔇 Session autre - Pas de guidage automatique');
    }
    
    return true;
  }, [currentSession, currentMeditation, voiceSettings, tryPremiumAudio]);
  
  return {
    speak,
    stop: stopVoice,
    startSessionGuidance,
    clearAllTimeouts,
    tryPremiumAudio
  };
}