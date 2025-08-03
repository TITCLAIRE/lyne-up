import { useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export const useVoiceManager = () => {
  const { voiceSettings, currentSession, currentMeditation, isSessionActive } = useAppStore();
  const timeoutsRef = useRef(new Set());
  const currentUtteranceRef = useRef(null);

  // Fonction pour nettoyer tous les timeouts
  const clearAllTimeouts = useCallback(() => {
    console.log('🧹 Nettoyage de tous les timeouts vocaux');
    timeoutsRef.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current.clear();
  }, []);

  // Fonction pour arrêter toute synthèse vocale
  const stop = useCallback(() => {
    console.log('🔇 ARRÊT COMPLET du système vocal');
    
    // Arrêter la synthèse vocale
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Arrêter l'utterance actuelle
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current = null;
    }
    
    // Nettoyer tous les timeouts
    clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Fonction principale de synthèse vocale
  const speak = useCallback((text) => {
    if (!voiceSettings.enabled || !text) {
      console.log('🔇 Voix désactivée ou texte vide');
      return false;
    }

    console.log('🎤 SPEAK SIMPLE:', text);

    try {
      // Arrêter toute synthèse en cours
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      // Créer une nouvelle utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = voiceSettings.volume || 0.7;

      // Stocker la référence
      currentUtteranceRef.current = utterance;

      // Événements
      utterance.onstart = () => {
        console.log('🎤 SYNTHÈSE DÉMARRÉE');
      };

      utterance.onend = () => {
        console.log('✅ SYNTHÈSE TERMINÉE');
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.log('❌ ERREUR SYNTHÈSE:', event.error);
        currentUtteranceRef.current = null;
      };

      // Lancer la synthèse
      window.speechSynthesis.speak(utterance);
      console.log('🗣️ SYNTHÈSE LANCÉE');
      
      return true;
    } catch (error) {
      console.error('❌ Erreur speak:', error);
      return false;
    }
  }, [voiceSettings.enabled, voiceSettings.volume]);

  // Fonction de démarrage de session simplifiée
  const startSessionGuidance = useCallback(() => {
    if (!voiceSettings.enabled || !isSessionActive) {
      console.log('🔇 Guidage vocal désactivé ou session inactive');
      return false;
    }

    console.log('🎤 START SESSION GUIDANCE SIMPLE - Session:', currentSession);

    // Nettoyer les anciens timeouts
    clearAllTimeouts();

    // Message de bienvenue immédiat
    const welcomeMessage = currentSession === 'scan' 
      ? "Bienvenue dans cette séance de scan corporel. Installez-vous confortablement."
      : currentSession === 'switch'
      ? "Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol."
      : "Bienvenue dans votre session. Le guidage vocal fonctionne.";

    // Parler immédiatement
    speak(welcomeMessage);

    // Messages programmés pour le scan corporel
    if (currentSession === 'scan') {
      const timeout1 = setTimeout(() => {
        speak("Portez votre attention sur le sommet de votre tête. Sentez cette zone se détendre complètement.");
      }, 30000); // 30 secondes

      const timeout2 = setTimeout(() => {
        speak("Descendez vers votre visage. Relâchez votre front, vos sourcils, vos paupières.");
      }, 60000); // 1 minute

      const timeout3 = setTimeout(() => {
        speak("Votre cou et vos épaules se relâchent maintenant. Laissez partir toute tension.");
      }, 90000); // 1 minute 30

      // Stocker les timeouts
      timeoutsRef.current.add(timeout1);
      timeoutsRef.current.add(timeout2);
      timeoutsRef.current.add(timeout3);
    }

    return true;
  }, [voiceSettings.enabled, isSessionActive, currentSession, speak, clearAllTimeouts]);

  return {
    speak,
    stop,
    startSessionGuidance,
    clearAllTimeouts
  };
};