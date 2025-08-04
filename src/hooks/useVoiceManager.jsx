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
    
    console.log('🎤 SYNTHÈSE VOCALE:', text);
    
    // Arrêter toute synthèse en cours
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.volume = voiceSettings.volume;
    
    utterance.onstart = () => {
      console.log('🎤 Synthèse démarrée');
    };
    
    utterance.onend = () => {
      console.log('🎤 Synthèse terminée');
    };
    
    utterance.onerror = (event) => {
      if (event.error === 'interrupted') {
        console.log('⚠️ Synthèse interrompue (normal)');
      } else {
        console.log('⚠️ Erreur synthèse:', event.error);
      }
    };
    
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, delay);
      timeoutsRef.current.push(timeoutId);
    } else {
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
  
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled) {
      console.log('🔇 Guidage vocal désactivé dans les paramètres');
      return false;
    }
    
    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession);
    console.log('🎤 Voix activée:', voiceSettings.enabled);
    console.log('🎤 Volume:', voiceSettings.volume);
    console.log('🎤 Genre:', voiceSettings.gender);
    
    // Test immédiat de la synthèse vocale
    speak("Test du système vocal. Si vous entendez ceci, la synthèse vocale fonctionne.", 500);
    
    // Démarrage spécifique pour SOS Stress (session SWITCH)
    if (currentSession === 'switch') {
      console.log('🚨 DÉMARRAGE SOS STRESS - SYSTÈME PREMIUM + FALLBACK');
      
      // Essayer d'abord les fichiers premium, puis fallback vers synthèse
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
      
      console.log('🔍 RECHERCHE FICHIERS PREMIUM POUR:', voiceName);
      
      // Séquence 1 : Message d'accueil (0.5s)
      const timeoutId1 = setTimeout(async () => {
        const audioPath = `./audio/sos-stress/${gender}/welcome.mp3`;
        console.log('🎵 TENTATIVE LECTURE PREMIUM:', audioPath);
        
        try {
          const audio = new Audio(audioPath);
          audio.volume = voiceSettings.volume;
          currentAudioRef.current = audio;
          
          audio.oncanplaythrough = async () => {
            try {
              await audio.play();
              console.log('🔊 LECTURE PREMIUM RÉUSSIE: welcome.mp3');
            } catch (playError) {
              console.log('🔄 FALLBACK SYNTHÈSE: welcome');
              speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.");
            }
          };
          
          audio.onerror = () => {
            console.log('🔄 FALLBACK SYNTHÈSE: welcome (erreur audio)');
            speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.");
          };
          
          audio.load();
          
        } catch (error) {
          console.log('🔄 FALLBACK SYNTHÈSE: welcome (erreur chargement)');
          speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.");
        }
      }, 500);
      timeoutsRef.current.push(timeoutId1);
      
      // Séquence 2 : Guidage respiratoire (12s)
      const timeoutId2 = setTimeout(() => {
        speak("Inspirez le calme");
      }, 12000);
      timeoutsRef.current.push(timeoutId2);
      
      // Séquence 3 : Ancrage (28s)
      const timeoutId3 = setTimeout(() => {
        speak("Vos pieds touchent le sol. Vous êtes ancré, solide, stable.");
      }, 28000);
      timeoutsRef.current.push(timeoutId3);
      
      // Séquence 4 : Guidage respiratoire (37s)
      const timeoutId4 = setTimeout(() => {
        speak("Soufflez doucement");
      }, 37000);
      timeoutsRef.current.push(timeoutId4);
      
      // Séquence 5 : Message de fin (85s)
      const timeoutId5 = setTimeout(() => {
        speak("Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.");
      }, 85000);
      timeoutsRef.current.push(timeoutId5);
      
      console.log('✅ SÉQUENCES SOS STRESS PROGRAMMÉES (Premium + Fallback)');
        
    } else {
      // Autres sessions avec synthèse vocale simple
      speak("Bienvenue dans votre session. Suivez le guide respiratoire.", 1000);
    }
    
    return true;
  }, [currentSession, voiceSettings, speak]);
  
  return {
    speak,
    stop: stopVoice,
    startSessionGuidance,
    clearAllTimeouts
  };
}