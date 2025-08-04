import { useRef, useCallback } from 'react';
import { useAppStore } from '../../store/appStore';

export function useVoiceManager() {
  const { currentSession, currentMeditation, voiceSettings } = useAppStore();

  // Ref pour gérer les timeouts de guidage vocal
  const timeoutsRef = useRef([]);
  
  
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);
  
  const speak = useCallback((text, delay = 0) => {
    if (!text || !voiceSettings.enabled) return;
    
    console.log('🎤 SPEAK:', text);
    
    // Arrêter toute synthèse en cours
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = voiceSettings.speed;
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
    
    window.speechSynthesis.speak(utterance);
  }, [voiceSettings]);
  
  const stopVoice = useCallback(() => {
    console.log('🔇 ARRÊT SYNTHÈSE VOCALE');
    window.speechSynthesis.cancel();
    clearAllTimeouts();
  }, [clearAllTimeouts]);
  
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) return false;
    
    console.log('🎤 START SESSION GUIDANCE - Session:', currentSession);
    
    // Nettoyage préventif
    clearAllTimeouts();
    
    // Messages selon la session
    if (currentSession === 'scan') {
      speak("Bienvenue dans cette séance de scan corporel. Installez-vous confortablement.");
      
      const timeout1 = setTimeout(() => {
        speak("Portez votre attention sur le sommet de votre tête. Ressentez cette zone.");
      }, 30000);
      
      const timeout2 = setTimeout(() => {
        speak("Maintenant, dirigez votre attention vers votre visage. Détendez tous les muscles.");
      }, 60000);
      
      timeoutsRef.current.push(timeout1, timeout2);
      
    } else if (currentSession === 'switch') {
      speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol.");
      
    } else {
      speak("Bienvenue dans votre session. Suivez le guide respiratoire.");
    }
    
    return true;
  }, [voiceSettings.enabled, isSessionActive, currentSession, speak, clearAllTimeouts]);
  
  return {
    speak,
  }
}