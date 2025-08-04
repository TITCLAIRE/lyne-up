import { useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export function useVoiceManager() {
  const { voiceSettings, currentSession } = useAppStore();

  // Ref pour gérer les timeouts de guidage vocal
  const timeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  
  const clearAllTimeouts = useCallback(() => {
    console.log('🧹 Nettoyage de tous les timeouts:', timeoutsRef.current.length);
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
    
    // Arrêter l'audio en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  }, []);
  
  const speak = useCallback((text, delay = 0) => {
    if (!text || !voiceSettings.enabled) {
      console.log('🔇 Synthèse vocale désactivée ou texte vide');
      return;
    }
    
    console.log('🎤 SYNTHÈSE VOCALE DÉCLENCHÉE:', text);
    
    // Arrêter toute synthèse en cours
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.volume = voiceSettings.volume;
    
    utterance.onstart = () => {
      console.log('🎤 Synthèse démarrée avec succès');
    };
    
    utterance.onend = () => {
      console.log('🎤 Synthèse terminée avec succès');
    };
    
    utterance.onerror = (event) => {
      console.log('⚠️ Erreur synthèse:', event.error);
    };
    
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        console.log('🎤 Exécution synthèse après délai:', delay, 'ms');
        window.speechSynthesis.speak(utterance);
      }, delay);
      timeoutsRef.current.push(timeoutId);
    } else {
      console.log('🎤 Exécution synthèse immédiate');
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceSettings]);

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

  const tryPremiumAudio = useCallback(async (audioKey, fallbackText, timing) => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Voix désactivée, pas de lecture premium');
      return false;
    }

    const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
    const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
    const audioPath = `/audio/sos-stress/${gender}/${audioKey}.mp3`;
    
    console.log(`🎵 TENTATIVE LECTURE PREMIUM: ${audioPath} (${voiceName})`);
    
    try {
      // Test de l'existence du fichier
      const response = await fetch(audioPath, { method: 'HEAD' });
      
      if (!response.ok) {
        console.log(`❌ FICHIER NON TROUVÉ: ${audioPath} (${response.status})`);
        console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Fichier non trouvé`);
        speak(fallbackText);
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
            console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur lecture`);
            speak(fallbackText);
            resolve(false);
          }
        };
        
        audio.onerror = () => {
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur audio`);
          speak(fallbackText);
          resolve(false);
        };
        
        // Timeout de sécurité
        setTimeout(() => {
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Timeout`);
          speak(fallbackText);
          resolve(false);
        }, 3000);
        
        audio.load();
      });
      
    } catch (error) {
      console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: Erreur réseau`);
      speak(fallbackText);
      return false;
    }
  }, [voiceSettings, speak]);
  
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé dans les paramètres');
      return false;
    }
    
    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession);
    console.log('🎤 Paramètres vocaux:', voiceSettings);
    
    // Test immédiat pour vérifier que la synthèse fonctionne
    console.log('🎤 TEST VOCAL IMMÉDIAT AU DÉMARRAGE');
    speak("Démarrage du guidage vocal", 500);
    
    // Démarrage spécifique pour SOS Stress (session SWITCH)
    if (currentSession === 'switch') {
      console.log('🚨 DÉMARRAGE SOS STRESS - SYSTÈME PREMIUM + FALLBACK');
      
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
      
      console.log(`🔍 RECHERCHE FICHIERS PREMIUM POUR: ${voiceName}`);
      
      // Séquence 1 : Message d'accueil (0.5s)
      const timeoutId1 = setTimeout(async () => {
        console.log('🎯 Séquence 1 (0.5s): Message d\'accueil');
        await tryPremiumAudio(
          'welcome', 
          "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.",
          500
        );
      }, 500);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Guidage respiratoire (12s)
      const timeoutId2 = setTimeout(async () => {
        console.log('🎯 Séquence 2 (12s): Inspirez le calme');
        await tryPremiumAudio('breathe-calm', "Inspirez le calme", 12000);
      }, 12000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Ancrage (28s)
      const timeoutId3 = setTimeout(async () => {
        console.log('🎯 Séquence 3 (28s): Ancrage');
        await tryPremiumAudio(
          'grounding', 
          "Vos pieds touchent le sol. Vous êtes ancré, solide, stable.",
          28000
        );
      }, 28000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Guidage respiratoire (37s)
      const timeoutId4 = setTimeout(async () => {
        console.log('🎯 Séquence 4 (37s): Soufflez doucement');
        await tryPremiumAudio('breathe-softly', "Soufflez doucement", 37000);
      }, 37000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Message de fin (85s)
      const timeoutId5 = setTimeout(async () => {
        console.log('🎯 Séquence 5 (85s): Message de fin');
        await tryPremiumAudio(
          'completion', 
          "Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.",
          85000
        );
      }, 85000);
      timeoutsRef.current.push(timeoutId5);
      
      console.log('✅ TOUTES LES SÉQUENCES SOS STRESS PROGRAMMÉES');
        
    } else {
      // Autres sessions avec synthèse vocale simple
      console.log('🎤 Session autre que SOS Stress, guidage simple');
      speak("Bienvenue dans votre session. Suivez le guide respiratoire.", 1000);
    }
    
    return true;
  }, [currentSession, voiceSettings, speak, tryPremiumAudio]);
  
  return {
    speak,
    stop: stopVoice,
    startSessionGuidance,
    clearAllTimeouts,
    tryPremiumAudio
  };
}