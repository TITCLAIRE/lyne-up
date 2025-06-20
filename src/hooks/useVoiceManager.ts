import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore';

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
}

// Voix ElevenLabs optimisées pour le bien-être
const ELEVENLABS_VOICES: Record<string, ElevenLabsVoice> = {
  female: {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Voix douce et apaisante
    name: 'Sarah',
    gender: 'female',
    accent: 'american'
  },
  male: {
    voice_id: 'VR6AewLTigWG4xSOukaG', // Josh - Voix calme et rassurante
    name: 'Josh', 
    gender: 'male',
    accent: 'american'
  }
};

export const useVoiceManager = () => {
  const { voiceSettings, currentSession, isSessionActive } = useAppStore();
  const queueRef = useRef<Array<{ text: string; priority: boolean }>>([]);
  const isProcessingRef = useRef(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // Système pour SOS Stress
  const sessionStartTimeRef = useRef<number>(0);
  const scheduledTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const breathingCountRef = useRef(0);
  const lastBreathingGuidanceRef = useRef(0);

  // Fonction pour parler avec ElevenLabs
  const speakWithElevenLabs = async (text: string): Promise<void> => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Clé API ElevenLabs manquante, utilisation des voix système');
      return speakWithSystemVoice(text);
    }

    try {
      const voice = ELEVENLABS_VOICES[voiceSettings.gender];
      console.log(`🎤 ElevenLabs: Génération audio pour "${text}" avec voix ${voice.name}`);
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: preprocessText(text),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.85,           // Très stable pour la relaxation
            similarity_boost: 0.8,     // Préserver le caractère de la voix
            style: 0.15,              // Style très naturel et doux
            use_speaker_boost: true    // Améliorer la clarté
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Créer et jouer l'audio
      const audio = new Audio(audioUrl);
      audio.volume = voiceSettings.volume;
      audioElementRef.current = audio;

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          audioElementRef.current = null;
          console.log(`✅ ElevenLabs: Audio terminé pour "${text}"`);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          audioElementRef.current = null;
          console.error(`❌ ElevenLabs: Erreur lecture audio pour "${text}"`);
          reject(new Error('Erreur de lecture audio'));
        };
        
        audio.play().then(() => {
          console.log(`🔊 ElevenLabs: Lecture démarrée pour "${text}"`);
        }).catch(reject);
      });

    } catch (error) {
      console.error('❌ Erreur ElevenLabs:', error);
      // Fallback vers les voix système
      return speakWithSystemVoice(text);
    }
  };

  // Préprocesser le texte pour optimiser la synthèse vocale
  const preprocessText = (text: string): string => {
    let processed = text.trim();

    // Optimisations pour le français et la relaxation
    processed = processed
      .replace(/\.\.\./g, '... ') // Pauses pour les points de suspension
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Espaces après ponctuation
      .replace(/(\d+)\s*(min|sec|secondes?|minutes?)/gi, '$1 $2') // Espaces pour les unités
      .replace(/([a-z])([A-Z])/g, '$1. $2'); // Points entre phrases collées

    // Ajouter des pauses naturelles pour la relaxation
    processed = processed
      .replace(/\./g, '... ') // Pauses longues après les points
      .replace(/,/g, ', ') // Pauses courtes après les virgules
      .replace(/:/g, ': '); // Pauses après les deux-points

    return processed;
  };

  // Fonction pour parler avec les voix système (fallback)
  const speakWithSystemVoice = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech Synthesis non supporté'));
        return;
      }

      console.log(`🗣️ Voix système: "${text}"`);
      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;

      // Configuration optimisée pour la relaxation
      utterance.rate = 0.75;  // Débit lent et apaisant
      utterance.pitch = voiceSettings.gender === 'male' ? 0.85 : 1.0;
      utterance.volume = voiceSettings.volume;
      utterance.lang = 'fr-FR';

      // Sélectionner la meilleure voix française disponible
      const voices = speechSynthesis.getVoices();
      const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
      
      if (frenchVoices.length > 0) {
        const preferredVoices = voiceSettings.gender === 'female' 
          ? ['Amélie', 'Marie', 'Audrey', 'Google français', 'Samantha']
          : ['Thomas', 'Nicolas', 'Google français', 'Alex'];
        
        let selectedVoice = null;
        for (const preferred of preferredVoices) {
          selectedVoice = frenchVoices.find(v => v.name.includes(preferred));
          if (selectedVoice) break;
        }
        
        utterance.voice = selectedVoice || frenchVoices[0];
        console.log(`🎤 Voix sélectionnée: ${utterance.voice.name}`);
      }

      utterance.onend = () => {
        currentUtteranceRef.current = null;
        console.log(`✅ Voix système: Terminé pour "${text}"`);
        resolve();
      };

      utterance.onerror = (event) => {
        currentUtteranceRef.current = null;
        console.error(`❌ Voix système: Erreur pour "${text}":`, event.error);
        reject(new Error(`Erreur voix système: ${event.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  };

  // Fonction principale pour parler
  const speak = async (text: string, priority: boolean = false): Promise<void> => {
    if (!voiceSettings.enabled || !text.trim()) return;

    const message = { text: text.trim(), priority };

    if (priority) {
      // Arrêter ce qui est en cours et mettre en priorité
      stop();
      queueRef.current.unshift(message);
    } else {
      queueRef.current.push(message);
    }

    processQueue();
  };

  // Traiter la queue de messages
  const processQueue = async (): Promise<void> => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const message = queueRef.current.shift();
    
    if (!message) {
      isProcessingRef.current = false;
      return;
    }

    try {
      console.log(`🎯 Traitement message: "${message.text}"`);
      
      if (voiceSettings.useElevenLabs) {
        await speakWithElevenLabs(message.text);
      } else {
        await speakWithSystemVoice(message.text);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la synthèse vocale:', error);
    }

    isProcessingRef.current = false;
    
    // Pause entre les messages pour une meilleure expérience
    setTimeout(() => {
      processQueue();
    }, 800); // Pause plus longue pour la relaxation
  };

  // SYSTÈME VOCAL POUR SOS STRESS - TIMINGS PARFAITS
  const startSessionGuidance = () => {
    if (currentSession !== 'sos') {
      // Pour les autres sessions, utiliser le système simple
      speak("Session démarrée. Suivez le guide respiratoire.", true);
      return;
    }

    console.log('🚨 DÉMARRAGE GUIDAGE SOS STRESS - SYSTÈME ELEVENLABS');
    sessionStartTimeRef.current = Date.now();
    breathingCountRef.current = 0;
    lastBreathingGuidanceRef.current = 0;

    // Nettoyer les anciens timeouts
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];

    // MESSAGE DE DÉMARRAGE IMMÉDIAT
    speak("Bienvenue dans votre bulle de calme. Posez vos pieds bien à plat sur le sol. Détendez vos épaules.", true);

    // GUIDAGES RESPIRATOIRES PROGRAMMÉS - TIMINGS CORRIGÉS
    const breathingTimeout1 = setTimeout(() => {
      if (isSessionActive) {
        speak("Inspirez le calme");
      }
    }, 10000); // 10s - sur inspiration

    const breathingTimeout2 = setTimeout(() => {
      if (isSessionActive) {
        speak("Soufflez doucement");
      }
    }, 35000); // 35s - sur expiration

    const breathingTimeout3 = setTimeout(() => {
      if (isSessionActive) {
        speak("Accueillez l'air frais");
      }
    }, 50000); // 50s - sur inspiration

    const breathingTimeout4 = setTimeout(() => {
      if (isSessionActive) {
        speak("Relâchez tout");
      }
    }, 65000); // 65s - sur expiration

    // MESSAGES DE PHASES PROGRAMMÉS - TIMINGS CORRIGÉS
    const phaseTimeout1 = setTimeout(() => {
      if (isSessionActive) {
        speak("Vos pieds touchent le sol. Vous êtes ancré, solide, stable.");
      }
    }, 30000); // 30s

    const phaseTimeout2 = setTimeout(() => {
      if (isSessionActive) {
        speak("Le stress s'évapore à chaque souffle. Votre corps se détend profondément.");
      }
    }, 55000); // 55s

    const phaseTimeout3 = setTimeout(() => {
      if (isSessionActive) {
        speak("Vous retrouvez votre centre. Tout va bien. Vous êtes en sécurité.");
      }
    }, 80000); // 80s

    // MESSAGE DE FIN PROGRAMMÉ - FIN EXACTE
    const endTimeout = setTimeout(() => {
      speak("Parfait. Vous avez retrouvé votre calme intérieur. Gardez cette sensation avec vous.");
    }, 90000); // 90s - fin exacte

    // Stocker tous les timeouts
    scheduledTimeoutsRef.current = [
      breathingTimeout1, breathingTimeout2, breathingTimeout3, breathingTimeout4,
      phaseTimeout1, phaseTimeout2, phaseTimeout3, endTimeout
    ];

    console.log('✅ SYSTÈME VOCAL SOS STRESS PROGRAMMÉ - ELEVENLABS READY');
  };

  // Guidage respiratoire limité pour SOS Stress
  const provideBreathingGuidance = (phase: 'inhale' | 'exhale') => {
    // Le guidage respiratoire est maintenant géré par les timeouts programmés
    // Cette fonction est conservée pour compatibilité mais n'est plus utilisée pour SOS Stress
    if (currentSession === 'sos') return;

    // Pour les autres sessions, guidage simple
    const now = Date.now();
    const timeSinceStart = (now - sessionStartTimeRef.current) / 1000;
    
    if (timeSinceStart < 15) return;

    if (phase === 'inhale') {
      breathingCountRef.current++;
    }

    const timeSinceLastGuidance = (now - lastBreathingGuidanceRef.current) / 1000;
    
    if (breathingCountRef.current % 15 === 0 && timeSinceLastGuidance > 30) {
      const messages = {
        inhale: ["Inspirez profondément"],
        exhale: ["Expirez lentement"]
      };

      const message = messages[phase][0];
      lastBreathingGuidanceRef.current = now;
      speak(message);
    }
  };

  // Terminer la session
  const endSessionGuidance = () => {
    if (currentSession === 'sos') {
      // Le message de fin est déjà programmé dans startSessionGuidance
      return;
    }
    
    // Pour les autres sessions
    speak("Session terminée. Félicitations pour cette pratique.", true);
  };

  // Arrêter la synthèse vocale
  const stop = (): void => {
    console.log('🛑 Arrêt complet du système vocal');
    queueRef.current = [];
    
    // Annuler tous les timeouts programmés
    scheduledTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    scheduledTimeoutsRef.current = [];
    
    // Arrêter ElevenLabs
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    
    // Arrêter les voix système
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    currentUtteranceRef.current = null;
    isProcessingRef.current = false;
    
    // Reset des compteurs
    breathingCountRef.current = 0;
    lastBreathingGuidanceRef.current = 0;
  };

  // Test de connexion ElevenLabs
  const testElevenLabsConnection = async (): Promise<boolean> => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) return false;

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: {
          'xi-api-key': apiKey
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Initialisation
  useEffect(() => {
    // Charger les voix système au démarrage
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        console.log('🗣️ Voix système chargées:', speechSynthesis.getVoices().length);
      });
    }

    // Tester la connexion ElevenLabs
    if (voiceSettings.useElevenLabs) {
      testElevenLabsConnection().then(connected => {
        console.log(connected ? '✅ ElevenLabs connecté' : '❌ ElevenLabs non disponible');
      });
    }

    return () => {
      stop();
    };
  }, [voiceSettings.useElevenLabs]);

  return {
    speak,
    stop,
    isProcessing: isProcessingRef.current,
    startSessionGuidance,
    provideBreathingGuidance,
    endSessionGuidance,
    testElevenLabsConnection,
  };
};