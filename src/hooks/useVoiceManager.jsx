import { useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export function useVoiceManager() {
  const { voiceSettings, currentSession } = useAppStore();

  // Ref pour gérer les timeouts de guidage vocal
  const timeoutsRef = useRef([]);
  const currentAudioRef = useRef(null);
  
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
    
    // Arrêter l'audio en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  }, []);
  
  const speak = useCallback((text, delay = 0) => {
    if (!text || !voiceSettings.enabled) return;
    
    console.log('🎤 SPEAK:', text);
    
    // Arrêter toute synthèse en cours
    window.speechSynthesis.cancel();
    
    // Arrêter l'audio premium en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1;
    utterance.volume = voiceSettings.volume;
    
    utterance.onstart = () => {
      console.log('🎤 SYNTHÈSE DÉMARRÉE');
    };
    
    utterance.onend = () => {
      console.log('🎤 SYNTHÈSE TERMINÉE');
    };
    
    utterance.onerror = (event) => {
      console.error('❌ ERREUR SYNTHÈSE:', event);
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
  
  // Fonction pour jouer un fichier audio premium avec fallback
  const playPremiumAudio = useCallback(async (audioKey, fallbackText, delay = 0) => {
    if (!voiceSettings.enabled) return;

    const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
    const audioPath = `/audio/sos-stress/${gender}/${audioKey}.mp3`;
    
    console.log(`🎵 TENTATIVE LECTURE AUDIO PREMIUM: ${audioPath}`);

    const timeoutId = setTimeout(async () => {
      try {
        // Tester si le fichier existe
        const response = await fetch(audioPath, { method: 'HEAD' });
        
        if (response.ok) {
          console.log(`✅ FICHIER PREMIUM TROUVÉ: ${audioPath}`);
          
          // Arrêter l'audio précédent
          if (currentAudioRef.current) {
            currentAudioRef.current.pause();
          }
          
          // Créer et jouer le nouvel audio
          const audio = new Audio(audioPath);
          audio.volume = voiceSettings.volume;
          currentAudioRef.current = audio;
          
          audio.onloadeddata = () => {
            console.log(`🔊 LECTURE DÉMARRÉE: ${audioPath}`);
            audio.play().catch(error => {
              console.error(`❌ ERREUR LECTURE: ${audioPath}`, error);
              // Fallback vers synthèse vocale
              speak(fallbackText);
            });
          };
          
          audio.onended = () => {
            console.log(`✅ AUDIO TERMINÉ: ${audioPath}`);
            currentAudioRef.current = null;
          };
          
          audio.onerror = () => {
            console.log(`❌ ERREUR AUDIO: ${audioPath} - Fallback vers synthèse`);
            speak(fallbackText);
          };
          
        } else {
          console.log(`❌ FICHIER NON TROUVÉ: ${audioPath} (${response.status}) - Fallback vers synthèse`);
          speak(fallbackText);
        }
      } catch (error) {
        console.log(`❌ ERREUR RÉSEAU: ${audioPath} - Fallback vers synthèse`);
        speak(fallbackText);
      }
    }, delay);
    
    timeoutsRef.current.push(timeoutId);
  }, [voiceSettings, speak]);

  const stopVoice = useCallback(() => {
    console.log('🔇 ARRÊT SYNTHÈSE VOCALE');
    window.speechSynthesis.cancel();
    
    // Arrêter l'audio premium
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    clearAllTimeouts();
  }, [clearAllTimeouts]);
  
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled) return false;
    
    console.log('🎤 START SESSION GUIDANCE - Session:', currentSession);
    
    // Nettoyage préventif
    clearAllTimeouts();
    
    // Démarrage spécifique pour SOS Stress (session SWITCH)
    if (currentSession === 'switch') {
      console.log('🚨 DÉMARRAGE SOS STRESS - SYSTÈME PREMIUM + FALLBACK');
      
      // Séquence 1 (0.5s) : Message d'accueil
      playPremiumAudio('welcome', 
        "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.", 
        500);
      
      // Séquence 2 (12s) : Guidage respiratoire
      playPremiumAudio('breathe-calm', 
        "Inspirez le calme", 
        12000);
      
      // Séquence 3 (28s) : Ancrage
      playPremiumAudio('grounding', 
        "Vos pieds touchent le sol. Vous êtes ancré, solide, stable.", 
        28000);
      
      // Séquence 4 (37s) : Guidage expiration
      playPremiumAudio('breathe-softly', 
        "Soufflez doucement", 
        37000);
      
      // Séquence 5 (48s) : Air frais
      playPremiumAudio('breathe-fresh', 
        "Accueillez l'air frais", 
        48000);
      
      // Séquence 6 (58s) : Libération du stress
      playPremiumAudio('stress-release', 
        "Le stress s'évapore à chaque souffle. Votre corps se détend profondément.", 
        58000);
      
      // Séquence 7 (67s) : Relâchement
      playPremiumAudio('breathe-release', 
        "Relâchez tout", 
        67000);
      
      // Séquence 8 (78s) : Recentrage
      playPremiumAudio('center-peace', 
        "Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.", 
        78000);
      
      // Séquence 9 (85s) : Message de fin
      playPremiumAudio('completion', 
        "Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.", 
        85000);
        
    } else if (currentSession === 'scan') {
      // Scan corporel avec fichiers premium
      playPremiumAudio('welcome', 
        "Bienvenue dans cette séance de scan corporel. Installez-vous confortablement.", 
        500);
      
      
      const timeout1 = setTimeout(() => {
        speak("Portez votre attention sur le sommet de votre tête. Ressentez cette zone.");
      }, 30000);
      
      const timeout2 = setTimeout(() => {
        speak("Maintenant, dirigez votre attention vers votre visage. Détendez tous les muscles.");
      }, 60000);
        setTimeout(() => playPremiumAudio('head', 
          "Portez votre attention sur le sommet de votre tête. Ressentez cette zone.", 
          0), 30000),
        setTimeout(() => playPremiumAudio('face', 
          "Maintenant, dirigez votre attention vers votre visage. Détendez tous les muscles.", 
          0), 60000)
      
      
      
    } else {
      // Autres sessions avec synthèse vocale
      speak("Bienvenue dans votre session. Suivez le guide respiratoire.");
    }
    
    return true;
  }, [currentSession, voiceSettings, speak, clearAllTimeouts, playPremiumAudio]);
  
  return {
    speak,
    stop: stopVoice,
    startSessionGuidance,
    clearAllTimeouts,
    playPremiumAudio
  };
}