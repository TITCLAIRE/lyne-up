import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';

export const useVoiceManager = () => {
  const { 
    voiceSettings, 
    currentSession, 
    isSessionActive
  } = useAppStore();
  
  const synth = useRef(window.speechSynthesis);
  const voices = useRef([]);
  const isInitialized = useRef(false);
  
  // Initialiser les voix françaises
  useEffect(() => {
    const initVoices = () => {
      if (synth.current) {
        voices.current = synth.current.getVoices().filter(voice => 
          voice.lang.includes('fr') || voice.name.includes('French')
        );
        
        if (voices.current.length === 0) {
          voices.current = synth.current.getVoices();
        }
        
        isInitialized.current = true;
        console.log('🎤 Voix initialisées:', voices.current.length);
      }
    };
    
    if (synth.current) {
      if (synth.current.getVoices().length > 0) {
        initVoices();
      }
      synth.current.onvoiceschanged = initVoices;
    }
  }, []);
  
  // Fonction simple pour parler
  const speak = useCallback((text) => {
    console.log('🎤 SPEAK:', text?.substring(0, 50));
    
    if (!voiceSettings.enabled || !text) {
      console.log('🔇 Voix désactivée ou texte vide');
      return;
    }
    
    try {
      // Arrêter toute synthèse en cours
      if (synth.current) {
        synth.current.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (voices.current.length > 0) {
        utterance.voice = voices.current[0];
      }
      
      utterance.volume = voiceSettings.volume;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.lang = 'fr-FR';
      
      utterance.onstart = () => {
        console.log('🎤 SYNTHÈSE DÉMARRÉE');
      };
      
      utterance.onend = () => {
        console.log('✅ SYNTHÈSE TERMINÉE');
      };
      
      utterance.onerror = (event) => {
        console.error('❌ ERREUR SYNTHÈSE:', event);
      };
      
      synth.current.speak(utterance);
      console.log('🗣️ SYNTHÈSE LANCÉE');
      
    } catch (error) {
      console.error('❌ ERREUR SPEAK:', error);
    }
  }, [voiceSettings.enabled, voiceSettings.volume]);
  
  // Fonction pour arrêter
  const stop = useCallback(() => {
    console.log('🔇 ARRÊT SYNTHÈSE');
    if (synth.current) {
      synth.current.cancel();
    }
  }, []);
  
  // Fonction pour démarrer le guidage vocal
  const startSessionGuidance = useCallback(() => {
    console.log('🎤 START SESSION GUIDANCE - Session:', currentSession);
    
    if (!voiceSettings.enabled) {
      console.log('🔇 Voix désactivée');
      return false;
    }
    
    if (!isSessionActive) {
      console.log('🔇 Session inactive');
      return false;
    }
    
    // Test immédiat de la voix
    speak("Bienvenue dans votre session. Le guidage vocal fonctionne.");
    
    // Programmer quelques messages selon la session
    if (currentSession === 'scan') {
      console.log('🧠 SCAN CORPOREL - Messages programmés');
      
      setTimeout(() => {
        if (isSessionActive && voiceSettings.enabled) {
          speak("Portez votre attention sur le sommet de votre tête.");
        }
      }, 10000); // 10 secondes
      
      setTimeout(() => {
        if (isSessionActive && voiceSettings.enabled) {
          speak("Descendez vers votre visage. Relâchez votre front.");
        }
      }, 30000); // 30 secondes
      
    } else if (currentSession === 'switch') {
      console.log('🚨 SOS STRESS - Messages programmés');
      
      setTimeout(() => {
        if (isSessionActive && voiceSettings.enabled) {
          speak("Inspirez le calme");
        }
      }, 5000); // 5 secondes
      
      setTimeout(() => {
        if (isSessionActive && voiceSettings.enabled) {
          speak("Vos pieds touchent le sol. Vous êtes ancré.");
        }
      }, 15000); // 15 secondes
    }
    
    return true;
  }, [currentSession, voiceSettings.enabled, isSessionActive, speak]);
  
  return {
    speak,
    stop,
    startSessionGuidance,
    clearAllTimeouts: () => {}, // Fonction vide pour compatibilité
    isInitialized: isInitialized.current,
  };
};