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
        // Test d'existence du fichier d'abord
        const response = await fetch(audioPath, { method: 'HEAD' });
        
        if (response.ok) {
          console.log(`✅ FICHIER TROUVÉ: ${audioPath} (${response.status})`);
          
          // Arrêter l'audio précédent
          if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
          }
          
          // Créer et jouer le fichier audio
          const audio = new Audio(audioPath);
          audio.volume = voiceSettings.volume;
          currentAudioRef.current = audio;
          
          audio.oncanplaythrough = async () => {
            try {
              await audio.play();
              console.log(`🔊 LECTURE PREMIUM DÉMARRÉE: ${audioPath} (${voiceName})`);
            } catch (playError) {
              console.log(`❌ ERREUR LECTURE: ${audioPath} - Fallback synthèse`);
              speak(fallbackText);
            }
          };
          
          audio.onended = () => {
            console.log(`✅ AUDIO PREMIUM TERMINÉ: ${audioPath} (${voiceName})`);
            currentAudioRef.current = null;
          };
          
          audio.onerror = () => {
            console.log(`❌ ERREUR AUDIO: ${audioPath} - Fallback synthèse`);
            speak(fallbackText);
          };
          
          // Charger le fichier
          audio.load();
          
        } else {
          console.log(`❌ FICHIER NON TROUVÉ: ${audioPath} (${response.status}) - Fallback synthèse`);
          speak(fallbackText);
        }
        
      } catch (error) {
        console.log(`🔄 FALLBACK SYNTHÈSE pour: ${audioKey} - Raison:`, error.message);
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
      console.log('🔍 TEST DES FICHIERS AUDIO SOS STRESS...');
      
      // Test immédiat de tous les fichiers
      const gender = voiceSettings.gender === 'male' ? 'male' : 'female';
      const audioFiles = [
        'welcome', 'breathe-calm', 'grounding', 'breathe-softly', 
        'breathe-fresh', 'stress-release', 'breathe-release', 'center-peace', 'completion'
      ];
      
      // Test de connectivité des fichiers
      audioFiles.forEach(async (file, index) => {
        try {
          const response = await fetch(`/audio/sos-stress/${gender}/${file}.mp3`, { method: 'HEAD' });
          if (response.ok) {
            console.log(`✅ /audio/sos-stress/${gender}/${file}.mp3 (${response.status})`);
          } else {
            console.log(`❌ /audio/sos-stress/${gender}/${file}.mp3 (${response.status})`);
          }
        } catch (error) {
          console.log(`❌ /audio/sos-stress/${gender}/${file}.mp3 (ERREUR RÉSEAU)`);
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
        
      console.log('✅ TOUTES LES SÉQUENCES SOS STRESS PROGRAMMÉES');
        
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