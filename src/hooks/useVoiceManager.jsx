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
    if (!text || !voiceSettings.enabled) return;
    
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
  
  // Fonction pour jouer un fichier audio premium avec fallback vers synthèse
  const playPremiumAudio = useCallback(async (audioKey, fallbackText, delay = 0) => {
    if (!voiceSettings.enabled) return;

    const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
    const voiceName = gender === 'male' ? 'Thierry' : 'Claire';
    const audioPath = `/audio/sos-stress/${gender}/${audioKey}.mp3`;
    
    console.log(`🎵 TENTATIVE LECTURE AUDIO PREMIUM: ${audioPath} (${voiceName})`);

    const timeoutId = setTimeout(async () => {
      try {
        // Arrêter l'audio précédent
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        }
        
        // Créer et tester le fichier audio
        const audio = new Audio(audioPath);
        audio.volume = voiceSettings.volume;
        currentAudioRef.current = audio;
        
        // Promesse pour gérer le chargement
        const loadPromise = new Promise((resolve, reject) => {
          audio.oncanplaythrough = () => {
            console.log(`✅ FICHIER PREMIUM CHARGÉ: ${audioPath} (${voiceName})`);
            resolve();
          };
          
          audio.onerror = (error) => {
            console.log(`❌ FICHIER PREMIUM NON TROUVÉ: ${audioPath} - Fallback vers synthèse`);
            reject(error);
          };
          
          // Timeout de 2 secondes pour éviter les blocages
          setTimeout(() => {
            reject(new Error('Timeout'));
          }, 2000);
        });
        
        try {
          await loadPromise;
          
          // Fichier chargé avec succès, le jouer
          await audio.play();
          console.log(`🔊 LECTURE PREMIUM DÉMARRÉE: ${audioPath} (${voiceName})`);
          
          audio.onended = () => {
            console.log(`✅ AUDIO PREMIUM TERMINÉ: ${audioPath} (${voiceName})`);
            currentAudioRef.current = null;
          };
          
        } catch (error) {
          // Fallback vers synthèse vocale
          console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison: ${error.message}`);
          currentAudioRef.current = null;
          speak(fallbackText);
        }
        
      } catch (error) {
        console.log(`❌ ERREUR GÉNÉRALE: ${audioPath} - Fallback vers synthèse`);
        speak(fallbackText);
      }
    }, delay);
    
    timeoutsRef.current.push(timeoutId);
  }, [voiceSettings, speak]);

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
      console.log('🔇 Guidage vocal désactivé');
      return false;
    }
    
    console.log('🎤 DÉMARRAGE GUIDAGE VOCAL - Session:', currentSession);
    console.log('🎤 Voix sélectionnée:', voiceSettings.gender === 'male' ? 'Thierry' : 'Claire');
    
    // Nettoyage préventif
    clearAllTimeouts();
    
    // Démarrage spécifique pour SOS Stress (session SWITCH)
    if (currentSession === 'switch') {
      console.log('🚨 DÉMARRAGE SOS STRESS - DIAGNOSTIC COMPLET (' + (voiceSettings.gender === 'male' ? 'Thierry' : 'Claire') + ')');
      
      // Test de tous les fichiers SOS Stress
      const audioFiles = [
        'welcome', 'breathe-calm', 'grounding', 'breathe-softly', 
        'breathe-fresh', 'stress-release', 'breathe-release', 'center-peace', 'completion'
      ];
      
      console.log('🔍 TEST DES FICHIERS AUDIO SOS STRESS...');
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      
      audioFiles.forEach(async (file) => {
        try {
          const response = await fetch(`/audio/sos-stress/${gender}/${file}.mp3`, { method: 'HEAD' });
          if (response.ok) {
            console.log(`✅ /audio/sos-stress/${gender}/${file}.mp3 (${response.status})`);
          } else {
            console.log(`❌ /audio/sos-stress/${gender}/${file}.mp3 (${response.status})`);
          }
        } catch (error) {
          console.log(`❌ /audio/sos-stress/${gender}/${file}.mp3 (erreur réseau)`);
        }
      });
      
      // Séquences SOS Stress avec timings parfaits
      playPremiumAudio('welcome', 
        "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.", 
        500);
      
      playPremiumAudio('breathe-calm', 
        "Inspirez le calme", 
        12000);
      
      playPremiumAudio('grounding', 
        "Vos pieds touchent le sol. Vous êtes ancré, solide, stable.", 
        28000);
      
      playPremiumAudio('breathe-softly', 
        "Soufflez doucement", 
        37000);
      
      playPremiumAudio('breathe-fresh', 
        "Accueillez l'air frais", 
        48000);
      
      playPremiumAudio('stress-release', 
        "Le stress s'évapore à chaque souffle. Votre corps se détend profondément.", 
        58000);
      
      playPremiumAudio('breathe-release', 
        "Relâchez tout", 
        67000);
      
      playPremiumAudio('center-peace', 
        "Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.", 
        78000);
      
      playPremiumAudio('completion', 
        "Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.", 
        85000);
        
    } else if (currentSession === 'scan') {
      console.log('🧘 DÉMARRAGE SCAN CORPOREL - SYSTÈME PREMIUM');
      
      // Scan corporel avec fichiers premium
      playPremiumAudio('welcome', 
        "Bienvenue dans cette séance de scan corporel. Installez-vous confortablement.", 
        500);
      
      playPremiumAudio('head', 
        "Portez votre attention sur le sommet de votre tête. Ressentez cette zone.", 
        30000);
      
      playPremiumAudio('face', 
        "Maintenant, dirigez votre attention vers votre visage. Détendez tous les muscles.", 
        60000);
      
      // Continuer avec les autres parties du corps...
      
    } else {
      // Autres sessions avec synthèse vocale
      speak("Bienvenue dans votre session. Suivez le guide respiratoire.", 1000);
    }
    
    return true;
  }, [currentSession, voiceSettings, clearAllTimeouts, playPremiumAudio, speak]);
  
  return {
    speak,
    stop: stopVoice,
    startSessionGuidance,
    clearAllTimeouts,
    playPremiumAudio
  };
}